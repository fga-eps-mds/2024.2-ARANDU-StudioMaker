import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { SubjectService } from "../subject/subject.service";
import { CreateKnowledgeDTO } from "./dtos/createKnowledge.dto";
import { UpdateKnowledgeDTO } from "./dtos/updateKnowledge.dto";
import { UpdateKnowledgeOrderInterface } from "./dtos/updateKnowledgeOrder.dto";
import { Knowledge } from "./knowledge.schema";


@Injectable()
export class KnowledgeService {
    private readonly logger = new Logger(KnowledgeService.name);

    constructor(
        @InjectModel('Knowledge')
        private readonly knowledgeModel: Model<Knowledge>,
        private readonly httpService: HttpService,
        private readonly subjectService: SubjectService
    ) { }

    async create(
        createKnowledgeDTO: CreateKnowledgeDTO,
        token: string
    ): Promise<Knowledge> {

        const userId = await this.validateTokenAndGetUserId(token);

        if (!userId) {
            this.logger.error(`Invalid token: ${token}`);
            throw new UnauthorizedException('Invalid Token!');
        }

        createKnowledgeDTO.user = userId;

        const newKnowledge = new this.knowledgeModel({
            ...createKnowledgeDTO
        });

        const savedKnowledge = await newKnowledge.save();

        await this.addKnowledgeToUser(userId, savedKnowledge._id.toString());

        return savedKnowledge;
    }

    async validateTokenAndGetUserId(token: string): Promise<string | null> {
        try {
            this.logger.log(`Validating token...`);
            const response = await firstValueFrom(
                this.httpService.get(`${process.env.AUTH_SERVICE_URL}/validate-token`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            );
            this.logger.log(`Token validation returned successfully`);
            return response.data.userPayload?.id || null;
        } catch (err) {
            this.logger.error(`Token validation failed: ${err.message}`);
            return null;
        }
    }

    async getAllKnowledge(): Promise<Knowledge[]> {
        return this.knowledgeModel.find().exec();
    }

    async getByUserId(userId: string): Promise<Knowledge[]> {
        return this.knowledgeModel.find({ user: userId }).exec();
    }

    async getById(id: string): Promise<Knowledge | undefined> {
        const knowledge = await this.knowledgeModel.findById(id).exec();

        if (!knowledge) throw new NotFoundException(`Knowledge Area with ID ${id} not found`);

        return knowledge;
    }


    async addKnowledgeToUser(userId: string, knowledgeId: string): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.put(
                    `${process.env.USER_SERVICE_URL}/${userId}/knowledges/${knowledgeId}/add`
                ),
            );
            this.logger.log(`Added knowledge to user!`);
        } catch (err) {
            this.logger.error(`Failed to add knowledge to user: ${err.message}`);
            throw new NotFoundException('Failed to update user with new knowledge');
        }
    }

    async update(
        id: string,
        updateKnowledgeDTO: UpdateKnowledgeDTO,
    ): Promise<Knowledge> {
        const knowledge = await this.knowledgeModel
            .findByIdAndUpdate(id, updateKnowledgeDTO, { new: true })
            .exec();

        if (!knowledge) throw new NotFoundException(`Knowledge Area with ID ${id} not found`);

        return knowledge;
    }

    async delete(id: string): Promise<Knowledge> {
        const knowledge = await this.knowledgeModel.findByIdAndDelete(id).exec();

        if (!knowledge) throw new NotFoundException(`Knowledge Area with ID ${id} not found`);

        this.logger.log(`Deleted knowledge!`);

        return knowledge;
    }

    async addSubjectToKnowledge(knowledgeId: string, subjectId: string): Promise<Knowledge> {
        const knowledge = await this.knowledgeModel.findById(knowledgeId).exec();

        if (!knowledge) throw new NotFoundException(`Knowledge Area with ID ${subjectId} not found`);

        const objectId = new Types.ObjectId(subjectId);

        knowledge.subjects = (knowledge.subjects ? knowledge.subjects : [])

        if (!knowledge.subjects.includes(objectId)) knowledge.subjects.push(objectId);

        return knowledge.save();
    }

    async getSubjectsByKnowledgeId(knowledgeId: string) {
        const knowledge = await this.knowledgeModel.findById(knowledgeId).exec();

        if (!knowledge) throw new NotFoundException(`Knowledge Area with ID ${knowledgeId} not found`);

        let subjects = await Promise.all(
            knowledge.subjects.map(async (subjectId) => {
                return this.subjectService.findById(subjectId.toString());
            })
        );
        return {
            knowledge,
            subjects
        }
    }

    async updateOrder(knowledges: UpdateKnowledgeOrderInterface[]) {
        const bulkOperations = knowledges.map((trail) => ({
            updateOne: {
                filter: { _id: new Types.ObjectId(trail._id) },
                update: { $set: { order: trail.order } },
            },
        }));

        const result = await this.knowledgeModel.bulkWrite(bulkOperations);
        console.log(`Bulk update result: ${JSON.stringify(result)}`);
        return result;
    }

}
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { CreateSubjectDTO } from "./dtos/createSubject.dto";
import { UpdateSubjectDTO } from "./dtos/updateSubject.dto";
import { UpdateSubjectOrderInterface } from "./dtos/updateSubjectOrder.dto";
import { Subject } from "./subject.schema";


@Injectable()
export class SubjectService {
    private readonly logger = new Logger(SubjectService.name);

    constructor(
        @InjectModel('Subject')
        private readonly subjectModel: Model<Subject>,
        private readonly httpService: HttpService
    ) { }

    async create(
        createSubjectDTO: CreateSubjectDTO,
        token: string
    ): Promise<Subject> {

        const userId = await this.validateTokenAndGetUserId(token);

        if (!userId) {
            this.logger.error(`Invalid token: ${token}`);
            throw new UnauthorizedException('Invalid Token!');
        }

        createSubjectDTO.user = userId;

        const newSubject = new this.subjectModel({
            ...createSubjectDTO
        });

        const savedSubject = await newSubject.save();

        await this.addSubjectToUser(userId, savedSubject._id.toString());

        return savedSubject;
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

    async findAll(): Promise<Subject[]> {
        return this.subjectModel.find().exec();
    }

    async findByUserId(userId: string): Promise<Subject[]> {
        return this.subjectModel.find({ user: userId }).exec();
    }

    async findById(id: string): Promise<Subject | undefined> {
        const subject = await this.subjectModel.findById(id).exec();

        if (!subject) throw new NotFoundException(`Subject with ID ${id} not found`);

        return subject;
    }

    async addSubjectToUser(userId: string, subjectId: string): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.put(
                    `${process.env.USER_SERVICE_URL}/${userId}/subjects/${subjectId}/add`
                ),
            );
            this.logger.log(`Added subject to user!`);
        } catch (err) {
            this.logger.error(`Failed to add subject to user: ${err.message}`);
            throw new NotFoundException('Failed to update user with new subject');
        }
    }

    async update(
        id: string,
        updateSubjectDTO: UpdateSubjectDTO,
    ): Promise<Subject> {
        const subject = await this.subjectModel
            .findByIdAndUpdate(id, updateSubjectDTO, { new: true })
            .exec();

        if (!subject) throw new NotFoundException(`Subject with ID ${id} not found`);

        return subject;
    }

    async delete(id: string): Promise<Subject> {
        const subject = await this.subjectModel.findByIdAndDelete(id).exec();

        if (!subject) throw new NotFoundException(`Subject with ID ${id} not found`);

        this.logger.log(`Deleted subject!`);

        return subject;
    }

    async addJourneyToSubject(subjectId: string, journeyId: string): Promise<Subject> {
        const subject = await this.subjectModel.findById(subjectId).exec();

        if (!subject) throw new NotFoundException(`Subject with ID ${subjectId} not found`);

        const objectId = new Types.ObjectId(journeyId);

        subject.journeys = (subject.journeys ? subject.journeys : [])

        if (!subject.journeys.includes(objectId)) subject.journeys.push(objectId);

        return subject.save();
    }

    async getJourneysBySubjectId(subjectId: string): Promise<Types.ObjectId[]> {
        const subject = await this.subjectModel.findById(subjectId).exec();

        if (!subject) throw new NotFoundException(`Subject with ID ${subjectId} not found`);

        return subject.journeys || [];
    }

    async updateOrder(subjects: UpdateSubjectOrderInterface[]) {
        const bulkOperations = subjects.map((trail) => ({
            updateOne: {
                filter: { _id: new Types.ObjectId(trail._id) },
                update: { $set: { order: trail.order } },
            },
        }));

        const result = await this.subjectModel.bulkWrite(bulkOperations);
        console.log(`Bulk update result: ${JSON.stringify(result)}`);
        return result;
    }

}
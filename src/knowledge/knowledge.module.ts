import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubjectModule } from "../subject/subject.module";
import { SubjectSchema } from "../subject/subject.schema";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeSchema } from "./knowledge.schema";
import { KnowledgeService } from "./knowledge.service";


@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([{ name: 'Knowledge', schema: KnowledgeSchema }]),
        MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
        forwardRef(() => SubjectModule),
    ],
    providers: [KnowledgeService],
    controllers: [KnowledgeController],
    exports: [KnowledgeService]
})
export class KnowledgeModule { }
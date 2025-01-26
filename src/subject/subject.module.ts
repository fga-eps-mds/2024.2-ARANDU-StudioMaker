import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from '../content/content.module';
import { SubjectController } from './subject.controller';
import { SubjectSchema } from './subject.schema';
import { SubjectService } from './subject.service';


@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([{ name: 'Subject', schema: SubjectSchema }]),
        forwardRef(() => ContentModule),
    ],
    providers: [SubjectService],
    controllers: [SubjectController],
    exports: [MongooseModule, SubjectService]
})
export class SubjectModule {}
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectModule } from '../subject/subject.module';
import { JourneyController } from './journey.controller';
import { JourneySchema } from './journey.schema';
import { JourneyService } from './journey.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'Journey', schema: JourneySchema }]),
    forwardRef(() => SubjectModule),
  ],
  providers: [JourneyService],
  controllers: [JourneyController],
  exports: [MongooseModule, JourneyService],
})
export class JourneyModule {}

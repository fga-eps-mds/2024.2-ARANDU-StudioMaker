import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ContentModule } from './content/content.module';
import { JourneyModule } from './journey/journey.module';
import { SubjectModule } from './subject/subject.module';
import { TrailModule } from './trail/trail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().default(3002),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    SubjectModule,
    ContentModule,
    JourneyModule,
    TrailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

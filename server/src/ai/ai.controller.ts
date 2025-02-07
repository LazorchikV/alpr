import {Controller, Inject, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {Resource, Service} from '../enums';
import {AIService} from './ai.service';

@Controller(Resource.AI)
export class AIController<T> {
    constructor(
        @Inject(Service.AI) private readonly aiService: AIService<any>,
    ) {}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ message: string; answer: Awaited<T>; }> {
     return this.aiService.uploadFile(file);
    }

    @Post('train')
    async trainModel(): Promise<string> {
        const { trainX, trainY } = await this.aiService.loadData();
        return this.aiService.trainModel(trainX, trainY);
    }
}


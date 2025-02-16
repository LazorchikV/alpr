import {Controller, Inject, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {Resource, Service} from '../enums';
import {AIService} from './ai.service';
import { IRecognition } from '../alpr/interfaces';

@Controller(Resource.AI)
export class AIController<T> {
    constructor(
        @Inject(Service.AI) private readonly aiService: AIService<any>,
    ) {}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Partial<T> & {
        imageUrl: string;
        recognizedPlate: IRecognition[]
    }> {
     return this.aiService.uploadFile(file);
    }
}


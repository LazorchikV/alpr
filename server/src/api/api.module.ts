import { Module } from '@nestjs/common';
import {ApiController} from './api.controller';
import {ProcessedFileModule} from '../processed-file/processed-file.module';
import {Service} from '../enums';
import {ApiService} from './api.service';

@Module({
    imports: [
        ProcessedFileModule,
    ],
    controllers: [ApiController],
    providers: [{
        useClass: ApiService,
        provide: Service.Api,
    }],
    exports: [
        Service.Api,
    ],
})
export class ApiModule {}

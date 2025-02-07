import {Module} from '@nestjs/common';
import {ProcessedFileService} from './processed-file.service';
import {Service} from '../enums';

@Module({
    imports: [
    ],
    providers: [{
        useClass: ProcessedFileService,
        provide: Service.ProcessedFile,
    }],
    exports: [
        Service.ProcessedFile,
    ]
})
export class ProcessedFileModule {}
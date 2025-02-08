import {Module} from '@nestjs/common';
import {Service} from '../enums';
import {AIController} from './ai.controller';
import {AIService} from './ai.service';
import {AWSService} from '../aws/aws.service';
import { AlprModule } from '../alpr/alpr.module';


@Module({
    imports: [
        AlprModule,
    ],
    controllers: [AIController],
    providers: [
        {
            useClass: AIService,
            provide: Service.AI,
        },
        {
            useClass: AWSService,
            provide: Service.AWS,
        },
    ],
    exports: [
        Service.AI,
    ],
})
export class AIModule {
}
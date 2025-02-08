import { Module } from '@nestjs/common';
import { Service } from '../enums';
import { AlprService } from './alpr.service';
import { AWSService } from '../aws/aws.service';


@Module({
  imports: [

  ],
  providers: [
    {
      useClass: AlprService,
      provide: Service.Alpr,
    },
    {
      useClass: AWSService,
      provide: Service.AWS,
    },
  ],
  exports: [
    Service.Alpr,
  ],
})
export class AlprModule {}
import { Module } from '@nestjs/common';
import { Service } from '../enums';
import { OpenAlprService } from './open-alpr.service';


@Module({
  imports: [

  ],
  providers: [
    {
      useClass: OpenAlprService,
      provide: Service.OpenAlpr,
    }
  ],
  exports: [
    Service.OpenAlpr,
  ],
})
export class OpenAlprModule {}
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {Service} from './enums';
import {ApiModule} from './api/api.module';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProcessedFileModule} from './processed-file/processed-file.module';
import {LoggingMiddleware} from './middleware/logging.middleware';
import {AIModule} from './ai/ai.module';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [
    ApiModule,
    ProcessedFileModule,
    AIModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      useClass: AppService,
      provide: Service.App,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(LoggingMiddleware)
        .forRoutes('*'); // Применить ко всем маршрутам
  }
}

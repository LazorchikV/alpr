import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:3000', // домены, которым разрешен доступ
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // методы, которые вы хотите разрешить
    allowedHeaders: 'Content-Type, Accept', // заголовки, которые вы хотите разрешить
  });

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //   next();
  // });

  await app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}
bootstrap();



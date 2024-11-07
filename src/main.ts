import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    // origin: 'http://localhost:5173',
    origin: 'https://672ca8299ff9de456d828fde--070707.netlify.app/',
    methods: 'GET,POST,PUT,HEAD,PATCH,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();

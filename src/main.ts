import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let allowedOrigins: string[];

  if (process.env.FRONTEND_ORIGINS) {
    allowedOrigins = process.env.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
  } else if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [];
  } else {
    allowedOrigins = ['http://localhost:5173'];
  }
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3002);
}
await bootstrap();

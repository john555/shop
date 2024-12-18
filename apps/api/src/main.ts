import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/api/app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'graphql';
  app.use(cookieParser(process.env.COOKIE_SECRET!));
  app.setGlobalPrefix(globalPrefix, {
    exclude: ['/health'], // Exclude health check from global prefix
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({ maxFiles: 5 }));

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT! || 4100;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    'NestApplication'
  );
  Logger.log(
    `Health check endpoint: http://localhost:${port}/health`,
    'NestApplication'
  );
}

bootstrap();

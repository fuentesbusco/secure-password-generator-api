import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed (to allow calls from a frontend on a different domain)
  app.enableCors();

  // Global ValidationPipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit conversion based on DTO types
      },
    }),
  );

  // Swagger (OpenAPI) setup
  const config = new DocumentBuilder()
    .setTitle('Secure Password Generator API')
    .setDescription('API for generating secure random passwords.')
    .setVersion('1.0')
    .addTag('Passwords', 'Endpoints related to password generation') // Matches @ApiTags
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Swagger UI will be at /api-docs

  await app.listen(process.env.PORT || 3000); // Listen on env port or 3000
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at ${await app.getUrl()}/api-docs`);
}
bootstrap();

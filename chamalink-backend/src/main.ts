import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Allow Frontend to talk to Backend

  // 👇 IMPORTANT: Use the system port OR 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

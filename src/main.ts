import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT;

  await app.listen(port || 5000, '0.0.0.0');
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
  console.error('Error during application startup:', error);
  process.exit(1);
});

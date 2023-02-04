import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './utils/pipes/validation.pipe';
import { JwtAuthGuard } from './utils/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: "*",
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Origin, OPTIONS, Authorization',
    methods: "GET,POST,DELETE,PATCH",
    credentials: true,
  });

  let port = '3000'
  if (process.env.port){
    port = process.env.port
  }
  await app.listen(port);
}
bootstrap();

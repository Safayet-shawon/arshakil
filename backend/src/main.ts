import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const origins = (process.env.FRONTEND_URL ?? "http://localhost:3000,http://localhost:3100")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, methods: ["GET", "POST"] });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  new Logger("Bootstrap").log(`API ready on http://localhost:${port}/api`);
}

bootstrap();

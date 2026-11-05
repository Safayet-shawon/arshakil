// Load backend/.env first, before anything reads process.env. Variables already set by the shell, Docker or systemd win.
import "dotenv/config";
import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Behind nginx, set TRUST_PROXY=1 so request.ip is the visitor's address (used by the rate limit), not nginx's.
  if (process.env.TRUST_PROXY) app.set("trust proxy", /^\d+$/.test(process.env.TRUST_PROXY) ? Number(process.env.TRUST_PROXY) : process.env.TRUST_PROXY);
  app.enableShutdownHooks();

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

import { Controller, Get, Inject } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import type Redis from "ioredis";
import type { DataSource } from "typeorm";
import { REDIS } from "../redis/redis.module";

@Controller("health")
export class HealthController {
  constructor(@Inject(REDIS) private readonly redis: Redis | null, @InjectDataSource() private readonly db: DataSource) {}

  @Get()
  async check() {
    let redis = "not configured";
    if (this.redis) {
      try { redis = (await this.redis.ping()) === "PONG" ? "up" : "down"; } catch { redis = "down"; }
    }
    let database = "down";
    try { await this.db.query("SELECT 1"); database = "up"; } catch { /* reported as down */ }
    return { status: database === "up" ? "ok" : "degraded", redis, database, uptime: Math.round(process.uptime()), time: new Date().toISOString() };
  }
}

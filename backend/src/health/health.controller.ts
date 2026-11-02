import { Controller, Get, Inject } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS } from "../redis/redis.module";

@Controller("health")
export class HealthController {
  constructor(@Inject(REDIS) private readonly redis: Redis | null) {}

  @Get()
  async check() {
    let redis = "not configured";
    if (this.redis) {
      try { redis = (await this.redis.ping()) === "PONG" ? "up" : "down"; } catch { redis = "down"; }
    }
    return { status: "ok", redis, uptime: Math.round(process.uptime()), time: new Date().toISOString() };
  }
}

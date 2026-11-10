import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import type { Request } from "express";
import type Redis from "ioredis";
import { REDIS } from "../redis/redis.module";

const WINDOW_S = 60;
const MAX_HITS = 5;

/**
 * At most 5 contact submissions per IP per minute.
 * Counts live in Redis (INCR + EXPIRE) so the limit is shared across server instances and survives
 * restarts. Without Redis, or if Redis is down, it falls back to an in-memory counter.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly memory = new Map<string, number[]>();

  constructor(@Inject(REDIS) private readonly redis: Redis | null) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const ip = ctx.switchToHttp().getRequest<Request>().ip ?? "unknown";
    if ((await this.hit(ip)) > MAX_HITS) {
      throw new HttpException("Too many messages. Please wait a minute and try again.", HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }

  private async hit(ip: string): Promise<number> {
    if (this.redis) {
      try {
        const key = `rl:contact:${ip}`;
        const n = await this.redis.incr(key);
        if (n === 1) await this.redis.expire(key, WINDOW_S);
        return n;
      } catch {
        // Redis unavailable: use the in-memory counter below
      }
    }
    const now = Date.now();
    const recent = (this.memory.get(ip) ?? []).filter((t) => now - t < WINDOW_S * 1000);
    recent.push(now);
    this.memory.set(ip, recent);
    return recent.length;
  }
}

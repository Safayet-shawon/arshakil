import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import type { Request } from "express";

const WINDOW_MS = 60_000;
const MAX_HITS = 5;

/** Tiny in-memory limiter: at most 5 contact submissions per IP per minute. */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, number[]>();

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_HITS) {
      throw new HttpException("Too many messages. Please wait a minute and try again.", HttpStatus.TOO_MANY_REQUESTS);
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

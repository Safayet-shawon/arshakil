import { CanActivate, ExecutionContext, Injectable, Logger, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { createHash, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

const digest = (s: string) => createHash("sha256").update(s).digest();

/**
 * Protects the admin endpoints with a shared secret in the `x-admin-key` header.
 * Only the Next.js server holds the key (it checks the admin's login first, then calls this API);
 * the browser never sees it. With no ADMIN_API_KEY set, every admin call is refused.
 */
@Injectable()
export class AdminKeyGuard implements CanActivate {
  private readonly log = new Logger(AdminKeyGuard.name);

  constructor() {
    const key = process.env.ADMIN_API_KEY;
    if (!key) this.log.warn("ADMIN_API_KEY is not set: admin endpoints are disabled.");
    else if (key.length < 24) this.log.warn("ADMIN_API_KEY is short; use at least 24 random characters.");
  }

  canActivate(ctx: ExecutionContext): boolean {
    const key = process.env.ADMIN_API_KEY;
    if (!key) throw new ServiceUnavailableException("Admin API is not configured");
    const given = ctx.switchToHttp().getRequest<Request>().header("x-admin-key") ?? "";
    // compare fixed-length digests so neither the length nor the content leaks through timing
    if (!timingSafeEqual(digest(given), digest(key))) throw new UnauthorizedException();
    return true;
  }
}

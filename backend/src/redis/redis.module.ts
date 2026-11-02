import { Global, Logger, Module } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS = "REDIS_CLIENT";

/**
 * One shared Redis client. It is `null` when REDIS_URL is not set, and everything that uses it
 * falls back to in-memory behaviour, so the API still runs without Redis (handy for quick local runs).
 */
@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: (): Redis | null => {
        const url = process.env.REDIS_URL;
        if (!url) return null;
        const log = new Logger("Redis");
        // fail fast instead of queueing commands while Redis is down
        const client = new Redis(url, { maxRetriesPerRequest: 1, enableOfflineQueue: false });
        client.on("ready", () => log.log("connected"));
        client.on("error", (e) => log.warn(e.message));
        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    OPEN_WEATHER_API_KEY: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1).url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    UPSTASH_RATELIMITER_TOKENS_PER_TIME: z.string().min(1),
    UPSTASH_RATELIMITER_TIME_INTERVAL: z.string().min(1),
    UPSTASH_RATELIMITER_EXCLUDED_IPS: z.string().default(""),
    RESEND_API_KEY: z.string().min(1),
    QWEATHER_API_KEY: z.string().min(1),
    API_NINJA_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_RATELIMITER_TOKENS_PER_TIME:
      process.env.UPSTASH_RATELIMITER_TOKENS_PER_TIME,
    UPSTASH_RATELIMITER_TIME_INTERVAL:
      process.env.UPSTASH_RATELIMITER_TIME_INTERVAL,
    UPSTASH_RATELIMITER_EXCLUDED_IPS:
      process.env.UPSTASH_RATELIMITER_EXCLUDED_IPS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    QWEATHER_API_KEY: process.env.QWEATHER_API_KEY,
    API_NINJA_API_KEY: process.env.API_NINJA_API_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});

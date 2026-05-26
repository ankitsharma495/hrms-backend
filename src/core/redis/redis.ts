// Redis client placeholder
// Enable when REDIS_URL is configured in .env

import { env } from '../config/env';

let redisClient: any = null;

export async function getRedisClient() {
  if (!env.REDIS_URL) {
    return null;
  }
  // Placeholder for future Redis integration
  return redisClient;
}

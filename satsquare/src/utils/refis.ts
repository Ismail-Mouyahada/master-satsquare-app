import Redis, { RedisOptions } from 'ioredis';
import { redis } from '../../configuration.ts';

interface Maybe<T> {
  value?: T;
  isPresent: boolean;
}

function getRedisConfiguration(): {
  port: Maybe<number>;
  host: Maybe<string>;
  password: Maybe<string>;
} {
  return {
    port: { value: redis.port ? parseInt(redis.port) : undefined, isPresent: redis.port !== undefined },
    host: { value: redis.host, isPresent: redis.host !== undefined },
    password: { value: redis.password, isPresent: redis.password !== undefined },
  };
}
 
export function createRedisInstance(
  config = getRedisConfiguration()
) {
  try {
    const options: RedisOptions = {
      host: config.host.value, // Use the value directly from Maybe<string>
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }
 
        return Math.min(times * 200, 1000);
      },
    };
 
    if (config.port.isPresent) {
      options.port = config.port.value;
    }
 
    if (config.password.isPresent) {
      options.password = config.password.value;
    }
 
    const redis = new Redis(options);
 
    redis.on('error', (error: unknown) => {
      console.warn('[Redis] Error connecting', error);
    });
 
    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}
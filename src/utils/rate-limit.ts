import type { NextApiResponse } from "next";
import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage! >= limit;

        return isRateLimited ? reject() : resolve();
      }),
    add: (token: string, limit: number) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      tokenCount[0] = limit;
      tokenCache.set(token, tokenCount);
    },
  };
}

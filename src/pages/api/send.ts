//type
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

import type { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { env } from "@/env.mjs";
import rateLimit from "@/utils/rate-limit";

const limiter = rateLimit({
  interval: 10 * 1000, // 60 seconds
  uniqueTokenPerInterval: 1000, // Max 500 users per second
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;
  const detectedIp = requestIp.getClientIp(req);

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { count, facultyId } = body;

  if (count >= 100 || count < 0) {
    return res.status(400).json({ message: "hmmmm!" });
  }

  try {
    if (count >= 80 && count <= 99) {
    //   console.log(`${detectedIp}-CACHE_TOKEN_1`);
      await limiter.check(res, 2, `${detectedIp}-CACHE_TOKEN_1`);
    } else if (count >= 60 && count < 79) {
    //   console.log(`${detectedIp}-CACHE_TOKEN_2`);
      await limiter.check(res, 3, `${detectedIp}-CACHE_TOKEN_2`);
    } else if (count >= 40 && count < 59) {
    //   console.log(`${detectedIp}-CACHE_TOKEN_3`);
      await limiter.check(res, 4, `${detectedIp}-CACHE_TOKEN_3`);
    } else if (count >= 20 && count < 39) {
    //   console.log(`${detectedIp}-CACHE_TOKEN_4`);
      await limiter.check(res, 5, `${detectedIp}-CACHE_TOKEN_4`);
    } else if (count >= 0 && count < 19) {
    //   console.log(`${detectedIp}-CACHE_TOKEN_5`);
      await limiter.check(res, 5, `${detectedIp}-CACHE_TOKEN_5`);
    }
  } catch (error) {
    return res.status(429).json({ message: "Too Many Requests" });
  }

  try {
    await pb.admins.authWithPassword(env.POCKETBASE_EMAIL, env.POCKETBASE_PASSWORD);
    await pb.collection("data").update<DataInterface>(facultyId, {
      "count+": count,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }

  res.status(200).json({ message: `success` });
}

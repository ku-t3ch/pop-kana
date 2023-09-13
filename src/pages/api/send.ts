//type
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

import type { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { env } from "@/env.mjs";
import rateLimit from "@/utils/rate-limit";

const limiter = rateLimit({
  interval: 10 * 1000, // 10 seconds
  uniqueTokenPerInterval: 1000, // Max 1000 users per second
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;
  const detectedIp = requestIp.getClientIp(req);

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { count, facultyId } = body;

  if (count > 500 || count < 0) {
    limiter.add(`${detectedIp}-CACHE_TOKEN_1`, 5);
    return res.status(200).json({ message: "success" });
  }

  try {
    await limiter.check(res, 5, `${detectedIp}-CACHE_TOKEN_1`);
  } catch (error) {
    return res.status(429).json({ message: "Too Many Requests" });
  }

  try {
    await pb.admins.authWithPassword(env.POCKETBASE_EMAIL, env.POCKETBASE_PASSWORD);
    await pb.collection("data").update<DataInterface>(facultyId, {
      "count+": Math.floor(count),
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong!" });
  }

  return res.status(200).json({ message: `success` });
}

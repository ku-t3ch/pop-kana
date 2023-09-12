//type
import type { NextApiRequest, NextApiResponse } from "next";
import type { DataInterface } from "@/interfaces/DataInterface";

import pb from "@/services/pocketbase";
import { env } from "@/env.mjs";
import rateLimit from "@/utils/rate-limit";

const limiter = rateLimit({
  interval: 5 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  try {
    await limiter.check(res, 2, "CACHE_TOKEN");
  } catch (error) {
    return res.status(429).json({ message: "Too Many Requests" });
  }

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { count, facultyId } = body;

  if (count >= 100 || count < 0) {
    return res.status(400).json({ message: "hmmmm!" });
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

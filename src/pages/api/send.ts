//type
import type { NextApiRequest, NextApiResponse } from "next";
import type { DataInterface } from "@/interfaces/DataInterface";

import pb from "@/services/pocketbase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { count, facultyId } = body;

  try {
    await pb.collection("data").update<DataInterface>(facultyId, {
      "count+": count,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }

  res.status(200).json({ message: `success` });
}

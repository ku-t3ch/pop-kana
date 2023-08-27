import pb from "@/services/pocketbase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let seeds = [
    {
      faculty_name: "คณะเกษตร",
      count: 0,
    },
    {
      faculty_name: "คณะบริหารธุรกิจ",
      count: 0,
    },
    {
      faculty_name: "คณะประมง",
      count: 0,
    },
    {
      faculty_name: "คณะมนุษยศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะวนศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะวิทยาศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะวิศวกรรมศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะศึกษาศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะเศรษฐศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะสถาปัตยกรรมศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะสังคมศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะสัตวแพทยศาสตร์",
      count: 0,
    },
    {
      faculty_name: "คณะอุตสาหกรรมเกษตร",
      count: 0,
    },
    {
      faculty_name: "คณะเทคนิคการสัตวแพทย์",
      count: 0,
    },
    {
      faculty_name: "คณะสิ่งแวดล้อม",
      count: 0,
    },
  ];

//   for (let i = 0; i < seeds.length; i++) {
//     await await pb.collection("data").create(seeds[i]);
//   }

  res.status(200).json({ message: seeds.length });
}

import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _ from "lodash";
import CountUp from "react-countup";
import { formatBigNumber } from "@/utils/formatBigNumber";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

interface Props {
  records: DataInterface[];
}

const RankList: NextPage<Props> = ({ records }) => {
  const [tmpRanks, setTmpRanks] = useState<DataInterface[]>();

  useEffect(() => {
    setTimeout(() => {
      setTmpRanks(records);
    }, 500);
  }, [records]);

  useEffect(() => {
    setTmpRanks(records);
  }, []);

  const rankColor = (rank: number) => {
    const maxRank = records.length;
    const fixedColor = 255;
    const blue = (rank / maxRank) * 255;
    return `rgb(${fixedColor}, ${fixedColor}, ${blue})`;
  };

  return (
    <div className="flex flex-col">
      <table>
        <tbody>
          {_.orderBy(records, ["count"], ["desc"])?.map((e, id) => {
            const diff = e.count - (tmpRanks?.[id]?.count || 0);
            const diffCountFormat = formatBigNumber(diff);
            return (
              <tr key={id} style={{ color: rankColor(id + 1) }} className={clsx(diff > 0 && "bg-green-500/50","duration-100")}>
                <td className="pr-10">{id + 1}.</td>
                <td className="pr-10">{e.faculty_name}</td>
                <td className="flex gap-1">
                  <CountUp formattingFn={(value) => formatBigNumber(value)} start={e.count < 10 ? 0 : e.count - 10} end={e.count} />
                  {/* <AnimatePresence>
                    {diff > 0 && (
                      <motion.p
                        animate={{
                          opacity: [0, 1],
                        }}
                        exit={{
                          opacity: [1, 0],
                        }}
                        className="font-bold text-lime-500"
                      >
                        +{diffCountFormat}
                      </motion.p>
                    )}
                  </AnimatePresence> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RankList;

import { DataInterface } from "@/interfaces/DataInterface";
import { formatBigNumber } from "@/utils/formatBigNumber";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import { use, useEffect, useState } from "react";
import CountUp from "react-countup";

interface Props {
  data: DataInterface;
  index: number;
}

const RankComponent: NextPage<Props> = ({ data, index }) => {
  const listPosition = ["st", "nd", "rd", "th"];
  const position = listPosition[index] || "th";

  const [DataTemp, setDataTemp] = useState<DataInterface>();

  useEffect(() => {
    setDataTemp(data);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setDataTemp(data);
    }, 1000);
  }, [data]);

  const diffCount = data.count - DataTemp?.count! || 0;

  return (
    <div
      key={data.id}
      className="flex w-full max-w-[34rem] justify-between gap-3 overflow-hidden  border-b "
    >
      <div
        className={clsx(
          "flex w-1/6 items-center justify-center text-base sm:text-xl font-bold text-white",
          position === "th" ? "bg-gray-400" : "bg-yellow-300"
        )}
      >
        {index + 1}
        {position}
      </div>
      <div className="flex w-full justify-between py-2 pr-5">
        <div className="text-sm sm:text-xl sm:font-bold">{data.faculty_name}</div>

        <div className="flex gap-2 text-sm sm:text-xl sm:font-bold">
          <AnimatePresence>
            {diffCount > 0 && (
              <motion.p
                animate={{
                  opacity: [0, 1],
                  transform: ["translateX(1rem)", "translateX(0)"],
                }}
                exit={{
                  opacity: [1, 0],
                  transform: ["translateX(0)", "translateX(1rem)"],
                }}
                className="text-green-500  sm:font-bold"
              >
                +{diffCount}
              </motion.p>
            )}
          </AnimatePresence>
          <CountUp start={DataTemp?.count} end={data.count} duration={1} separator="," />
        </div>
      </div>
    </div>
  );
};

export default RankComponent;

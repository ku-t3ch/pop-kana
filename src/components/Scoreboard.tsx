import { FC, useEffect, useState } from "react";
import { DataInterface } from "@/interfaces/DataInterface";
import { Icon } from "@iconify/react";
import clsx from "clsx";

import pb from "@/services/pocketbase";
import tw from "tailwind-styled-components";
import CountUp from "react-countup";
import _ from "lodash";
import { useLocalStorage } from "usehooks-ts";
import { ArrowLeftRight } from "lucide-react";
import Loading from "./Loading";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  isOpen?: boolean;
  openModal?: () => void;
  isPage?: boolean;
}

const Scoreboard: FC<Props> = ({ isOpen = false, openModal, isPage }) => {
  const [tmpRanks, setTmpRanks] = useState<DataInterface[]>([]);
  const [Ranks, setRanks] = useState<DataInterface[]>();
  const hasNewData = Ranks?.length !== 0;
  const [selectedFaculty, setSelectedFaculty] = useLocalStorage<DataInterface | null>(
    "faculty-id",
    null
  );

  useEffect(() => {
    syncRankData();
  }, []);

  const syncRankData = async () => {
    pb.autoCancellation(false);

    // fetch init data
    const records = await pb.collection("data").getFullList<DataInterface>({
      sort: "-count",
    });

    checkApiUrlChange(records);

    // set init data
    setTmpRanks(records);

    // setup sync data
    pb.collection("data").subscribe<DataInterface>("*", function (e) {
      const newData = records.map((item) => {
        if (item.id === e.record.id) {
          return e.record;
        }
        return item;
      });

      setTmpRanks(newData);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setRanks(tmpRanks);
    }, 1500);
  }, [tmpRanks]);

  const checkApiUrlChange = (records: DataInterface[]) => {
    if (!selectedFaculty) return;
    let result = records.find(
      (item) =>
        item.faculty_name === selectedFaculty?.faculty_name && item.id === selectedFaculty?.id
    );
    if (!result) {
      setSelectedFaculty(null);
    }
  };

  return (
    <>
      <Card.Main className={clsx(!isPage && "max-w-[30rem]", "relative")}>
        <div className="absolute left-2 top-0 -translate-y-6 text-white drop-shadow-lg">
          Made by KU Tech
        </div>
        <Header.Main onClick={openModal} className="flex w-full justify-between ">
          <Icon className="text-[1.5rem]" icon="ic:round-leaderboard" />
          {isOpen ? (
            <div>🏆 Scoreboard</div>
          ) : (
            <div className="flex gap-2">
              <div>🥇 {_.orderBy(Ranks, ["count"], ["desc"])[0]?.faculty_name}</div>
            </div>
          )}

          <Icon
            className="text-[1.5rem]"
            icon={isOpen ? "iconamoon:arrow-down-2" : "iconamoon:arrow-up-2"}
          />
        </Header.Main>
        <Card.Body>
          {_.orderBy(Ranks, ["count"], ["desc"])?.map((data, idx) => {
            const tmpCount = tmpRanks.find((rank) => rank.id === data.id)?.count ?? 0;
            const diffCount = tmpCount - data.count;
            console.log(diffCount);
            return (
              <FacultyItem key={idx}>
                <div className="w-[60vw]">
                  {idx + 1}. {data.faculty_name}
                </div>
                <div className="flex w-[40vw] justify-end gap-1 text-end">
                  <AnimatePresence>
                    {diffCount > 0 && (
                      <motion.p
                        animate={{
                          opacity: [0, 1],
                        }}
                        exit={{
                          opacity: [1, 0],
                        }}
                        className="font-bold text-lime-500"
                      >
                        +{diffCount} click{diffCount > 1 ? "s" : ""}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <CountUp start={data.count} end={data.count + diffCount} />
                  click{data.count > 1 ? "s" : ""}
                </div>
              </FacultyItem>
            );
          })}
        </Card.Body>
      </Card.Main>
      {!isPage && (
        <button
          onClick={() => setSelectedFaculty(null)}
          className="flex w-full cursor-pointer items-center justify-center gap-3 bg-blue-500 py-[.5rem] text-white hover:bg-blue-600"
        >
          <ArrowLeftRight size={20} /> เปลี่ยนคณะ
        </button>
      )}
    </>
  );
};

const Card = {
  Main: tw.div`
      w-[100vw]
      bg-white
      rounded-t-[.5rem]
      px-[1rem]
      text-[.9rem]
      drop-shadow-lg
    `,
  Body: tw.div`
      max-h-[40rem]
      overflow-y-auto
    `,
};

const Header = {
  Main: tw.div`
      border-b
      py-[.85rem]
      flex
      text-bold
      text-[1rem]
    `,
  Title: tw.div`
      flex
      gap-1
      items-center
    `,
  Icon: tw.div`
      text-[1.5rem]
      flex
      items-center
      justify-end
    `,
};

const FacultyItem = tw.div`
    flex
    py-[.5rem]
    border-b
    last:border-0
  `;

export default Scoreboard;

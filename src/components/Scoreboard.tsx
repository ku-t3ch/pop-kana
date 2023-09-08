import { FC, useEffect, useState } from "react";
import { DataInterface } from "@/interfaces/DataInterface";
import { Icon } from "@iconify/react";
import clsx from "clsx";

import pb from "@/services/pocketbase";
import tw from "tailwind-styled-components";
import CountUp from "react-countup";
import _ from "lodash";
import { useLocalStorage } from "usehooks-ts";

interface Props {
  isOpen?: boolean;
  openModal?: () => void;
  isPage?: boolean;
}

const Scoreboard: FC<Props> = ({ isOpen = false, openModal,isPage }) => {
  const [Ranks, setRanks] = useState<DataInterface[]>();
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

    // set init data
    setRanks(records);

    // setup sync data
    pb.collection("data").subscribe<DataInterface>("*", function (e) {
      const newData = records.map((item) => {
        if (item.id === e.record.id) {
          return e.record;
        }
        return item;
      });

      setRanks(newData);
    });
  };

  return (
    <>
      <Card.Main className={clsx(!isPage && "max-w-[30rem]")}>
        <Header.Main onClick={openModal}>
          <Header.Title className="w-[50vw]">
            <Icon icon="ic:round-leaderboard" />
            <div>Scoreboard</div>
          </Header.Title>
          <Header.Icon className="w-[50vw]">
            <Icon
              icon={isOpen ? "iconamoon:arrow-down-2" : "iconamoon:arrow-up-2"}
            />
          </Header.Icon>
        </Header.Main>
        <Card.Body>
          {_.orderBy(Ranks, ["count"], ["desc"])?.map((data, idx) => {
            return (
              <FacultyItem key={idx}>
                <div className="w-[60vw]">
                  {idx + 1}. {data.faculty_name}
                </div>
                <div className="w-[40vw] text-end">
                  <CountUp
                    start={data.count < 10 ? 0 : data.count - 10}
                    end={data.count}
                  />{" "}
                  click
                </div>
              </FacultyItem>
            );
          })}
        </Card.Body>
      </Card.Main>
      {!isPage &&  <button onClick={()=>setSelectedFaculty(null)} className="w-full bg-blue-500 hover:bg-blue-600 py-[.5rem] text-white cursor-pointer">
        เปลี่ยนคณะ
      </button>}
     
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

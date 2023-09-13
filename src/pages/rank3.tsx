import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _ from "lodash";
import { formatBigNumber } from "@/utils/formatBigNumber";
import clsx from "clsx";
import RankComponent from "@/components/RankComponent";

interface Props {}

const Rank3: NextPage<Props> = () => {
  const [Ranks, setRanks] = useState<DataInterface[]>();

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
      setRanks((prev) => {
        const newData = prev?.map((item) => {
          if (item.id === e.record.id) {
            return e.record;
          }
          return item;
        });
        return newData;
      });
    });
  };

  useEffect(() => {
    syncRankData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      {_.orderBy(Ranks, ["count"], ["desc"]).map((item, index) => {
        return <RankComponent data={item} index={index} key={index} />;
      })}
    </div>
  );
};

export default Rank3;

import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _ from "lodash";

interface Props {
  recordsInit: DataInterface[];
}

const RankList: NextPage<Props> = ({ recordsInit }) => {
  const [Ranks, setRanks] = useState(recordsInit);

  useEffect(() => {
    pb.collection("data").subscribe<DataInterface>("*", function (e) {
      const newData = Ranks.map((item) => {
        if (item.id === e.record.id) {
          return e.record;
        }
        return item;
      });
      setRanks(newData);
    });
  }, []);

  const rankColor = (rank: number) => {
    const maxRank = Ranks.length;
    const fixedColor = 255;
    const blue = (rank / maxRank) * 255;
    return `rgb(${fixedColor}, ${fixedColor}, ${blue})`;
  };

  return (
    <div className="flex flex-col justify-evenly">
      <div className="flex flex-col">
        {Ranks?.map((e, id) => (
          <div
            key={id}
            style={{color: rankColor(id + 1)}}
          >
            {id + 1}. {e.faculty_name} {e.count}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankList;

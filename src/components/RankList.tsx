import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _, { set } from "lodash";

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

  return (
    <>
      <div className="flex flex-col">
        {Ranks?.map((e, id) => (
          <div key={id}>
            {e.faculty_name} {e.count}
          </div>
        ))}
      </div>
    </>
  );
};

export default RankList;

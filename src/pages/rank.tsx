import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import RankList from "@/components/RankList";

interface Props {}

const Rank: NextPage<Props> = () => {
  const [Ranks, setRanks] = useState<DataInterface[]>();

  useEffect(() => {
    getFirst();
  }, []);

  const getFirst = async () => {
    pb.autoCancellation(false);
    const records = await pb.collection("data").getFullList<DataInterface>({
      sort: "-count",
    });
    setRanks(records);
  };

  if (!Ranks) return <div>loading</div>;

  return (
    <>
      <RankList recordsInit={Ranks} />
    </>
  );
};

export default Rank;

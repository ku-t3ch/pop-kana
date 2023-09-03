import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import RankList from "@/components/RankList";
import styles from "@/styles/rank.module.css";

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
    <div className="grid w-scree lg:grid-cols-3 grid-cols-2">
      <div className="hidden lg:block">
        top 3 preview image
      </div>
      <div className="flex flex-row h-screen col-span-2 relative text-3xl">
        <div className={styles.imgBackground}>
          <div className={styles.imgLogo}></div>
          <div className="relative m-5"><RankList recordsInit={Ranks} /></div>
        </div>
      </div>
    </div>
  );
};

export default Rank;

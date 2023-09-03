import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import RankList from "@/components/RankList";
import PlacesImage from "@/components/PlacesImage";
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
    <div className="grid w-scree lg:grid-cols-2 grid-cols-1">
      <div className="hidden lg:block">
        <PlacesImage facultyName={Ranks[0]?.faculty_name as string} />
        <PlacesImage facultyName={Ranks[1]?.faculty_name as string} />
        <PlacesImage facultyName={Ranks[2]?.faculty_name as string} />
      </div>
      <div className="flex flex-row h-screen relative text-3xl">
        <div className={styles.imgBackground}>
          <div className={styles.imgLogo}></div>
          <div className="relative m-5"><RankList recordsInit={Ranks} /></div>
        </div>
      </div>
    </div>
  );
};

export default Rank;

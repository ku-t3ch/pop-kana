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
    <div className="grid h-full w-screen grid-cols-1 lg:grid-cols-2">
      <button className="absolute z-10 m-3 pr-5 pl-5 pt-2 pb-2 bg-white rounded-lg">Back</button>
      <div className="hidden h-screen min-h-full lg:flex flex-col">
        <PlacesImage facultyName={Ranks[0]?.faculty_name as string} />
        <PlacesImage facultyName={Ranks[1]?.faculty_name as string} />
        <PlacesImage facultyName={Ranks[2]?.faculty_name as string} />
      </div>
      <div className="relative flex h-screen flex-row overflow-y-auto text-3xl">
        <div className={styles.imgBackground}>
          <div className={styles.imgLogo}></div>
          <div className="relative m-5">
            <RankList recordsInit={Ranks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rank;

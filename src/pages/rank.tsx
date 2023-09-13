import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import RankList from "@/components/RankList";
import PlacesImage from "@/components/PlacesImage";
import styles from "@/styles/rank.module.css";
import _ from "lodash";
import Loading from "@/components/Loading";

interface Props {}

const Rank: NextPage<Props> = () => {
  const [Ranks, setRanks] = useState<DataInterface[]>();

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

  if (!Ranks) return <Loading />;

  const ranksSorted = _.orderBy(Ranks, ["count"], ["desc"]);

  return (
    <div className="grid h-full w-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden h-screen min-h-full flex-col lg:flex">
        <PlacesImage
          facultyName={ranksSorted[0]?.faculty_name as string}
          rank={ranksSorted[0]!}
          place={<div className="text-4xl">1st</div>}
        />
        <PlacesImage
          facultyName={ranksSorted[1]?.faculty_name as string}
          rank={ranksSorted[1]!}
          place={<div className="text-4xl">2nd</div>}
        />
        <PlacesImage
          facultyName={ranksSorted[2]?.faculty_name as string}
          rank={ranksSorted[2]!}
          place={<div className="text-4xl">3rd</div>}
        />
      </div>
      <div className="relative flex h-screen flex-row overflow-y-auto text-3xl">
        <div className={styles.imgBackground}>
          <div className={styles.imgLogo}></div>
          <div className="relative m-5">
            <RankList records={ranksSorted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rank;

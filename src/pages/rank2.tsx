import { DataInterface } from '@/interfaces/DataInterface';
import pb from '@/services/pocketbase';
import { NextPage } from 'next'
import { useEffect, useState } from 'react';
import RankList from '@/components/RankList';
import Scoreboard from '@/components/Scoreboard';
import Loading from '@/components/Loading';

interface Props {}

const Rank2: NextPage<Props> = () => {
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
  
    if (!Ranks) return  <Loading />;

    return (
        <>
        <Scoreboard isPage />
        </>
    )
}

export default Rank2
import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _ from "lodash";

interface Props {
  recordsInit: DataInterface[];
}

function formatNumber(num: number): string {
  if (num >= 1e6) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'QQ', 'S', 'SS', 'O', 'N', 'D'];

    const suffixIndex = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, suffixIndex)).toFixed(3);
    return shortNum.replace(/\.0*$/, '') + suffixes[suffixIndex];
  }
  return num.toString();
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
    <table>
      <tbody>
        {Ranks?.map((e, id) => (
          <tr key={id} style={{ color: rankColor(id + 1) }}>
            <td className="pr-10">{id + 1}.</td>
            <td className="pr-10">{e.faculty_name}</td>
            <td>{formatNumber(e.count)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default RankList;

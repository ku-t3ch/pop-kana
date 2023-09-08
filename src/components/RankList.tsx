import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _ from "lodash";
import CountUp from "react-countup";

interface Props {
  recordsInit: DataInterface[];
}

function formatNumber(num: number): string {
  return num.toLocaleString("th-TH");
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
          {_.orderBy(Ranks, ["count"], ["desc"])?.map((e, id) => (
            <tr key={id} style={{ color: rankColor(id + 1) }}>
              <td className="pr-10">{id + 1}.</td>
              <td className="pr-10">{e.faculty_name}</td>
              <td>
                <CountUp
                  start={e.count < 10 ? 0 : e.count - 10}
                  end={e.count}
                //   children={(value) => formatNumber(value.)}
                duration={5}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankList;

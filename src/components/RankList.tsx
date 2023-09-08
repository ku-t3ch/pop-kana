import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import _ from "lodash";
import CountUp from "react-countup";

interface Props {
  records: DataInterface[];
}

const RankList: NextPage<Props> = ({ records }) => {

  const rankColor = (rank: number) => {
    const maxRank = records.length;
    const fixedColor = 255;
    const blue = (rank / maxRank) * 255;
    return `rgb(${fixedColor}, ${fixedColor}, ${blue})`;
  };

  return (
    <div className="flex flex-col justify-evenly">
      <table>
        <tbody>
          {_.orderBy(records, ["count"], ["desc"])?.map((e, id) => (
            <tr key={id} style={{ color: rankColor(id + 1) }}>
              <td className="pr-10">{id + 1}.</td>
              <td className="pr-10">{e.faculty_name}</td>
              <td>
                <CountUp start={e.count < 10 ? 0 : e.count - 10} end={e.count} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankList;

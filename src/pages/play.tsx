import type { DataInterface } from "@/interfaces/DataInterface";

import pb from "@/services/pocketbase";
import NoSSR from "@/components/NoSSR";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import { randomGrade, randomNumber } from "@/utils/random";
import { useEffect, useRef, useState } from "react";

// rate update amount to database
const sendPerCount = 7;

export default function Home() {
  const { width, height } = useWindowDimensions();

  const stash = useRef<number>(0);
  const [score, setScore] = useState<number>(0);

  const handleClick: () => Promise<void> = async () => {
    setScore((p) => p + 1);
    stash.current += 1;

    if (stash.current == sendPerCount) {
      stash.current = 0;
      try {
        await pb.collection("data").update<DataInterface>("vu7tba7w24ye4rq", {
          "count+": 5,
        });
      } catch {}
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <NoSSR>
      <div
        key={score + 1}
        className="fixed text-[2.5rem]"
        style={{
          opacity: 0,
          top: `${randomNumber(60, height - 100)}px`,
          left: `${randomNumber(50, width - 50)}px`,
          animation: "fadeIn .5s",
        }}
      >
        {randomGrade()}
      </div>
      <div
        key={score}
        className="flex justify-center py-[1rem] text-[2.5rem]"
        style={{
          animation: "shaking 0.25s",
        }}
      >
        {score.toLocaleString()}
      </div>
    </NoSSR>
  );
}

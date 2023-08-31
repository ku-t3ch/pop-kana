import pb from "@/services/pocketbase";

import { useEffect, useRef, useState } from "react";
import type { DataInterface } from "@/interfaces/DataInterface";

// rate update amount to database
const sendPerCount = 7;

export default function Home() {
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
    <>
      <div
        key={score}
        className="flex justify-center py-[1rem] text-[2.5rem]"
        style={{
          animation: "shaking 0.25s",
        }}
      >
        {score.toLocaleString()}
      </div>
    </>
  );
}

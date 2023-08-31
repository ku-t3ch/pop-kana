// type
import type { DataInterface } from "@/interfaces/DataInterface";

import { useEffect, useRef, useState } from "react";
import { randomGrade, randomNumber } from "@/utils/random";

import Image from "next/image";
import pb from "@/services/pocketbase";
import NoSSR from "@/components/NoSSR";

// cat image
import CatWow from "@/assets/cat-wow.png";
import CatDefault from "@/assets/cat-default.png";

// rate update amount to database
const sendPerCount = 7;

export default function Home() {
  const stash = useRef<number>(0);
  const isDelay = useRef<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [text, setText] = useState<GradeTextInterface>({});
  const [isCatAction, setCatAction] = useState<boolean>(false);

  // set background
  useEffect(() => {
    document.body.style.backgroundColor = "#09FF2A";
  }, []);

  const handleClick: () => void = () => {
    // delay
    if (isDelay.current) return;
    isDelay.current = true;

    // sound effect
    const audio = new Audio("/pop.mp3");

    audio.playbackRate = 3;
    audio.volume = 0.5;
    audio.play();

    // cat animation
    const { innerWidth: width, innerHeight: height } = window;

    setCatAction(true);
    setText({
      x: randomNumber(50, width - 50),
      y: randomNumber(60, height - 100),
      value: randomGrade(),
    });

    // logic
    setScore((p) => p + 1);
    stash.current += 1;

    if (stash.current == sendPerCount) {
      stash.current = 0;
      pb.collection("data")
        .update<DataInterface>("vu7tba7w24ye4rq", {
          "count+": 5,
        })
        .catch(() => {});
    }

    setTimeout(() => {
      isDelay.current = false;
      setCatAction(false);
    }, 50);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <NoSSR>
      <div className="fixed bottom-0 flex w-full justify-center">
        <Image
          src={isCatAction ? CatWow : CatDefault}
          width={0}
          height={0}
          style={{
            width: "auto",
          }}
          alt={"cat"}
        />
      </div>
      <div
        key={`grade-[${score}]`}
        className="fixed text-[2.5rem] text-white"
        style={{
          opacity: 0,
          top: `${text.y}px`,
          left: `${text.x}px`,
          animation: "fadeIn .5s",
        }}
      >
        <span className="drop-shadow-lg">{text.value}</span>
      </div>
      <div
        key={`score-[${score}]`}
        className="flex justify-center py-[1.5rem] text-[2.5rem] text-white"
        style={{
          animation: "shaking .5s",
        }}
      >
        <span className="drop-shadow-xl">{score.toLocaleString()}</span>
      </div>
    </NoSSR>
  );
}

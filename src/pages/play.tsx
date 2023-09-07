// type
import type { DataInterface } from "@/interfaces/DataInterface";
import type { EmojiInterface } from "@/interfaces/EmojiInterface";

// commons
import Image from "next/image";
import pb from "@/services/pocketbase";
import NoSSR from "@/components/NoSSR";
import tw from "tailwind-styled-components";
import { useEffect, useRef, useState } from "react";
import { randomNumber } from "@/utils/random";
import { random as getEmoji } from "emoji-random-list";

// assets
import CatWow from "@/assets/cat-wow.png";
import CatDefault from "@/assets/cat-default.png";
import Background from "@/assets/background.png";

// components
import Scoreboard from "@/components/Scoreboard";

// rate update amount to database
const sendPerCount = 7;

export default function Home() {
  const stash = useRef<number>(0);
  const isDelay = useRef<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [effects, setEffects] = useState<EmojiInterface[]>([]);
  const [isCatAction, setCatAction] = useState<boolean>(false);
  const [isOpenScoreboard, setIsOpenScoreboard] = useState<boolean>(false);

  // set background
  useEffect(() => {
    document.body.style.background = `url(${Background.src}) fixed bottom`;
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
    const x = randomNumber(10, width - 50);
    const y = randomNumber(150, height - 100);
    const rgb = `rgb(${randomNumber(0, 255)}, ${randomNumber(
      0,
      255
    )}, ${randomNumber(0, 255)})`;

    setCatAction(true);
    setEffects((p) => [
      ...p,
      {
        x,
        y,
        color: rgb,
        value: getEmoji({ n: 1, group: "Food & Drink" })[0],
      },
    ]);

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

  useEffect(() => {
    if (effects.length < 10) return;

    setEffects([]);
  }, [effects]);

  return (
    <NoSSR>
      <Navbar.Container>
        <Navbar.Faculty>คณะวิทยาศาสตร์</Navbar.Faculty>
        <Navbar.Score
          key={`score-[${score}]`}
          style={{
            animation: "shaking .5s",
          }}
        >
          {score.toLocaleString()}
        </Navbar.Score>
      </Navbar.Container>

      {effects.map((effect, idx) => {
        return (
          <Effects.Container
            key={`effect-[${idx}]`}
            style={{
              top: `${effect.y}px`,
              left: `${effect.x}px`,
            }}
          >
            <Effects.Text
              style={{
                color: effect.color,
                opacity: 0,
                animation: "fadeOut 3s",
              }}
            >
              {effect.value}
            </Effects.Text>
          </Effects.Container>
        );
      })}

      <div
        className="fixed left-1/2 -translate-x-1/2"
        style={{
          bottom: isOpenScoreboard ? "0rem" : "-36.25rem",
          transition: "all .5s ease-in-out",
        }}
      >
        <Scoreboard
          isOpen={isOpenScoreboard}
          openModal={() => setIsOpenScoreboard((isOpen) => !isOpen)}
        />
      </div>

      <Character.Container>
        <Image
          src={isCatAction ? CatWow : CatDefault}
          width={0}
          height={0}
          style={{
            width: "auto",
          }}
          alt={"cat"}
        />
      </Character.Container>
    </NoSSR>
  );
}

const Navbar = {
  Container: tw.div`
    flex
    flex-col
    items-center
    py-[1.5rem]
    text-white
  `,
  Faculty: tw.div`
    text-[2rem]
    drop-shadow-lg  
  `,
  Score: tw.span`
    text-[3rem]
    drop-shadow-lg
  `,
};

const Character = {
  Container: tw.div`
    fixed
    bottom-0
    flex
    w-full
    justify-center
    z-[-1]
  `,
};

const Effects = {
  Container: tw.div`
    fixed
    text-[2.5rem]
  `,
  Text: tw.span`
    text-[3rem]
  `,
};

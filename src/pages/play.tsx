// type
import type { DataInterface } from "@/interfaces/DataInterface";
import type { EmojiInterface } from "@/interfaces/EmojiInterface";

// commons
import Image from "next/image";
import NoSSR from "@/components/NoSSR";
import tw from "tailwind-styled-components";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { randomNumber } from "@/utils/random";
import { random as getEmoji } from "emoji-random-list";
import { Howl } from "howler";
import axios from "axios";
// assets
import Background from "@/assets/background.png";
// components
import Scoreboard from "@/components/Scoreboard";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import { CatDefault, CatWow } from "@/assets/catImage";
import _ from "lodash";

export default function Home() {
  const [selectedFaculty, setSelectedFaculty] = useLocalStorage<DataInterface | null>(
    "faculty-id",
    null
  );
  const { push } = useRouter();
  const stash = useRef<number>(0);
  const stashCheck = useRef<number>(0);
  const stashCheck2 = useRef<number>(0);
  const isDelay = useRef<boolean>(false);
  const isBot = useRef<boolean>(false);
  const isBotClick = useRef<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [effects, setEffects] = useState<EmojiInterface[]>([]);
  const [isCatAction, setCatAction] = useState<boolean>(false);
  const [isOpenScoreboard, setIsOpenScoreboard] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFaculty === null) {
      push("/");
    }
  }, [selectedFaculty, push]);

  // set background
  useEffect(() => {
    document.body.style.background = `url(${Background.src}) fixed bottom`;
  }, []);

  const updateScore = useMemo(
    () =>
      debounce(async (count: number) => {
        try {
          stash.current = 0;
          await axios.post("/api/send", {
            count,
            facultyId: selectedFaculty?.id,
          });
        } catch (err) {}
      }, 1000),
    [selectedFaculty?.id]
  );

  const updateScoreDefault = useMemo(
    () => async (count: number) => {
      try {
        stash.current = 0;
        await axios.post("/api/send", {
          count,
          facultyId: selectedFaculty?.id,
        });
      } catch (err) {}
    },
    [selectedFaculty?.id]
  );

  useEffect(() => {
    const handleClick: () => void = () => {
      if (isBot.current) return;
      // check
      stashCheck.current += 1;
      stashCheck2.current += 1;

      // delay
      if (isDelay.current) return;
      isDelay.current = true;

      // sound effect
      const indexPOP = randomNumber(1, 4);
      var sound = new Howl({
        src: [`/pop${indexPOP}.ogg`],
        html5: true,
      });
      sound.play();
      sound.once("end", () => {
        sound.unload();
      });

      // cat animation
      const { innerWidth: width, innerHeight: height } = window;
      const x = randomNumber(10, width - 50);
      const y = randomNumber(150, height - 100);
      const rgb = `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;

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

      if (stash.current >= 99) {
        updateScoreDefault(stash.current);
      } else {
        updateScore(stash.current);
      }

      setTimeout(() => {
        isDelay.current = false;
        setCatAction(false);
      }, 50);
    };
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [selectedFaculty?.id]);

  useEffect(() => {
    if (effects.length < 10) return;

    setEffects([]);
  }, [effects]);

  //   useEventListener("keydown", handleClick);

  useEffect(() => {
    let keyInterval = setInterval(() => {
      if (stashCheck.current > 14) {
        isBot.current = true;
        clearInterval(keyInterval);
      }
      stashCheck.current = 0;
    }, 1000);
    return () => {
      clearInterval(keyInterval);
    };
  }, []);

  useEffect(() => {
    let listCount: number[] = [];

    let keyInterval = setInterval(() => {
      if (listCount.length === 7 && _.uniq(listCount).length < 3) {
        isBot.current = true;
        clearInterval(keyInterval);
      }

      if (listCount.length >= 7) {
        let first = listCount[0];
        let isBotCheck = 0;
        listCount.map((count) => {
          if (count === first) {
            isBotCheck += 1;
          }
        });

        if (isBotCheck >= listCount.length) {
          isBot.current = true;
          clearInterval(keyInterval);
        }
        listCount = [];
      }
      if (stashCheck2.current > 0) {
        listCount.push(stashCheck2.current);
        stashCheck2.current = 0;
      }
    }, 1000);
    return () => {
      clearInterval(keyInterval);
    };
  }, []);

  return (
    <NoSSR>
      <Navbar.Container>
        <Navbar.Faculty>{selectedFaculty?.faculty_name}</Navbar.Faculty>
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
          bottom: isOpenScoreboard ? "0rem" : "-39rem",
          transition: "all .5s cubic-bezier(0.83, 0.02, 0.29, 0.98) 0s",
        }}
      >
        <Scoreboard
          isOpen={isOpenScoreboard}
          openModal={() => setIsOpenScoreboard((isOpen) => !isOpen)}
        />
      </div>

      <Character.Container>
        <img
          src={isCatAction ? CatWow : CatDefault}
          width={200}
          height={200}
          style={{
            width: "auto",
            height: "80vh",
            objectFit: "contain",
            objectPosition: "bottom",
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

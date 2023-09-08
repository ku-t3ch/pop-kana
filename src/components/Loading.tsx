import { NextPage } from "next";
import clsx from "clsx";
import { css } from "@emotion/css";

interface Props {}

const Loading: NextPage<Props> = () => {
  return (
    <div className="flex min-h-screen items-center justify-center backdrop-blur-lg">
      <div
        className={clsx(
          "animate-bounce text-3xl drop-shadow-lg",
          css`
            animation: rainbow-colors 2s linear infinite, bounce 1s infinite;
            animation-delay: calc(-2s * var(--char-percent));
            color: hsl(calc(360deg * var(--char-percent)), 90%, 65%);

            @keyframes bounce {
              0%,
              100% {
                transform: translateY(-25%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
              50% {
                transform: none;
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }

            @keyframes rainbow-colors {
              0% {
                color: hsl(197, 97%, 66%, 1);
              }
              25% {
                color: hsl(0, 100%, 100%, 1);
              }
              50% {
                color: hsl(348, 83%, 81%, 1);
              }
              75% {
                color: hsl(0.75turn, 90%, 65%);
              }
              100% {
                color: hsl(1turn, 90%, 65%);
              }
            }
          `
        )}
      >
        just a moment...
      </div>
    </div>
  );
};

export default Loading;

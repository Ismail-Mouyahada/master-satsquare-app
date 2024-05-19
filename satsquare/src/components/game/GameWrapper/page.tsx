import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import background from "@/assets/bg.jpg";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import Button from "@/components/Button";

 

interface QuestionState {
  current: number;
  total: number;
}

interface Props {
  children: ReactNode;
  textNext: string;
  onNext: () => void;
  manager: boolean;
}

export default function GameWrapper({ children, textNext, onNext, manager }: Props): JSX.Element {
  const { socket } = useSocketContext();
  const { player, dispatch } = usePlayerContext();
  const router = useRouter();

  const [questionState, setQuestionState] = useState<QuestionState | null>(null);

  useEffect(() => {
    socket.on("game:kick", () => {
      dispatch({
        type: "LOGOUT",
      });

      router.replace("/");
    });

    socket.on("game:updateQuestion", ({ current, total }: QuestionState) => {
      setQuestionState({
        current,
        total,
      });
    });

    return () => {
      socket.off("game:kick");
      socket.off("game:updateQuestion");
    };
  }, [socket, dispatch, router]);

  return (
    <section className="relative flex flex-col justify-between w-full min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 -z-10">
        <Image
          className="object-cover w-full h-full pointer-events-none opacity-60"
          src={background}
          alt="background"
        />
      </div>

      <div className="flex justify-between w-full p-4">
        {questionState && (
          <div className="flex items-center p-2 px-4 text-lg font-bold text-black bg-white rounded-md shadow-inset">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <Button
            className="self-end bg-white px-4 !text-black"
            onClick={onNext}
          >
            {textNext}
          </Button>
        )}
      </div>

      {children}

      {!manager && (
        <div className="z-50 flex items-center justify-between px-4 py-2 text-lg font-bold text-white bg-white">
          <p className="text-gray-800">{player && player.username}</p>
          <div className="px-3 py-1 text-lg bg-gray-800 rounded-sm">
            {player && player.points}
          </div>
        </div>
      )}
    </section>
  );
}

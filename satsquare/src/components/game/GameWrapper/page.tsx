import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import background from "@/assets/gamegackground.jpg";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import Button from "@/components/Button";
import { FaPowerOff } from "react-icons/fa";
import { GAME_STATES } from "@/constants/db";

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
  const [inviteCode, setInviteCode] = useState(() => localStorage.getItem('inviteCode'));

  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : {
      ...GAME_STATES,
      status: {
        ...GAME_STATES.status,
        name: "SHOW_ROOM",
      },
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('gameState');
    localStorage.removeItem('inviteCode');
    setState({
      ...GAME_STATES,
      status: {
        ...GAME_STATES.status,
        name: "SHOW_ROOM",
      },
    });
    setInviteCode(null);
    // redirect to home
    router.replace("/");
  };

  useEffect(() => {
    const handleKick = () => {
      dispatch({
        type: "LOGOUT",
      });
      router.replace("/");
    };

    const handleUpdateQuestion = ({ current, total }: QuestionState) => {
      setQuestionState({ current, total });
    };

    socket.on("game:kick", handleKick);
    socket.on("game:updateQuestion", handleUpdateQuestion);

    return () => {
      socket.off("game:kick", handleKick);
      socket.off("game:updateQuestion", handleUpdateQuestion);
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
          <div className="flex items-center p-2 px-4 text-lg font-bold text-black bg-slate-50 rounded-md shadow-inset">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <div className="flex items-center justify-between w-full">
            <Button className="self-end bg-slate-50 px-4 !text-black" onClick={onNext}>
              {textNext}
            </Button>

            <button onClick={handleLogout} className="p-3 m-2 bg-red-500 text-white rounded-md flex items-center justify-center">
              <FaPowerOff className="scale-150" />
            </button>
          </div>
        )}
      </div>

      {children}

      {!manager && player && (
        <div className="z-50 flex items-center justify-between px-4 py-2 text-lg font-bold text-white bg-slate-50">
          <p className="text-gray-800">{player.username}</p>
          <div className="px-3 py-1 text-lg bg-gray-800 rounded-sm">
            {player.points}
          </div>
        </div>
      )}
    </section>
  );
}

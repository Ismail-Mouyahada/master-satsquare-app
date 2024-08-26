import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import background from "@/assets/gamegackground.jpg";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import Button from "@/components/Button";
import { FaArrowAltCircleRight, FaCheck, FaCopy, FaPowerOff, FaRedo, FaUser, FaUserCircle } from "react-icons/fa";
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
  const [copied, setCopied] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState<string[]>([]);

  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    socket.on("game:updateWaitingList", (players) => {
      setWaitingList(players);
    });

    return () => {
      socket.off("game:updateWaitingList");
    };
  }, [socket]);

  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Réinitialisation après 2 secondes
    }
  };

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

  const handleRestartGame = () => {
    // Reset game state logic
    setState({
      ...GAME_STATES,
      status: {
        ...GAME_STATES.status,
        name: "SHOW_ROOM",
      },
    });
    setQuestionState(null); // Reset question state
    localStorage.removeItem('gameState'); // Clear saved state
    socket.emit("game:restart", { inviteCode }); // Emit restart event
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

    const handleUserJoined = (username: string) => {
      setJoinedUsers((prev) => [...prev, username]);
    };

    const handleUserLeft = (username: string) => {
      setJoinedUsers((prev) => prev.filter(user => user !== username));
    };

    socket.on("game:kick", handleKick);
    socket.on("game:updateQuestion", handleUpdateQuestion);
    socket.on("game:userJoined", handleUserJoined);
    socket.on("game:userLeft", handleUserLeft);

    return () => {
      socket.off("game:kick", handleKick);
      socket.off("game:updateQuestion", handleUpdateQuestion);
      socket.off("game:userJoined", handleUserJoined);
      socket.off("game:userLeft", handleUserLeft);
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

      <div className="p-2 bg-primary bg-opacity-55 text-white flex items-center justify-between z-40">
        <button onClick={handleLogout} className="p-3 m-2 bg-red-500 text-white rounded-md flex items-center justify-center">
          <FaPowerOff className="scale-100" />
        </button>
        <div>
          <p className="px-3 text-amber-400"> {copied ? 'Copié avec succès' : ''} </p>
          <p className="font-extrabold text-lg">ID salle: {inviteCode}</p>
        </div>

        <button
          onClick={copyToClipboard}
          className="p-3 m-2 bg-[#c9aa6c!important] text-white rounded-md flex items-center hover:bg-[#9c8149]"
        >
          {copied ? <FaCheck className="" /> : <FaCopy className="" />}
        </button>
      </div>

      <div className="flex justify-between w-full p-2">
        {questionState && (
          <div className="flex justify-center items-center font-bold mr-2 text-white text-center bg-[#c9aa6c!important] rounded-md shadow-inset min-w-16">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <div className="flex items-center justify-between w-full z-40">
            <Button className="bg-[#c9aa6c!important] p-2 py-4 text-gray-800" onClick={onNext}>
              <div className="flex items-center justify-between w-full">
                <p className="text-slate-750">{textNext}</p> <FaArrowAltCircleRight className="scale-150 mx-3 text-slate-750" />
              </div>
            </Button>

            <button onClick={handleRestartGame} className="p-3 m-2 bg-emerald-400 text-white rounded-md flex items-center justify-center">
              <FaRedo className="scale-100" />
            </button>
          </div>
        )}
      </div>

      {manager && waitingList.length > 0 && (
        <div className="bg-gray-700 bg-opacity-55 text-white  rounded-md m-3 px-4 py-2">
          <h3 className="font-light  text-xl my-4">+ Liste des joueurs en attente</h3>
          <ul>
            {waitingList.map((user: any)  => (
              <li   className="flex flex-row items-center justify-between my-2 p-3 rounded-md bg-slate-500 bg-opacity-55 text-white" key={user.id}>
                <div className="flex flex-row"><FaUserCircle className="mr-2 scale-150  " /><p className="font-extrabold"> {user.username || ''}</p></div> <p className="text-bold  py-2 px-4  rounded-full bg-slate-800 bg-opacity-45">{user.points} pt</p>
              </li>
            ))}
          </ul>
        </div>
      )}


 
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

"use client";

import { Button, Card, FloatingLabel } from "flowbite-react";
import Logo from "../components/Logo/Logo";
import { FaBeer, FaGamepad, FaLightbulb } from "react-icons/fa";
import LogoHeader from "../components/LogoHeader/LogoHeader";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import { useEffect, useState } from "react";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import Input from "@/components/Input";

export default function Home() {
  const { player, dispatch } = usePlayerContext();
  const [roomId, setRoomId] = useState("");
  const { socket } = useSocketContext();

  const handleLogin = () => {
    socket.emit("player:checkRoom", roomId);
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    socket.on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId });
    });

    return () => {
      socket.off("game:successRoom");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("game:errorMessage", (message: Renderable | ValueFunction<Renderable, Toast>) => {
      toast.error(message);
    });

    return () => {
      socket.off("game:errorMessage");
    };
  }, [socket]);

  return (
    <main className="flex flex-col w-full min-h-screen px-10 pt-10 survey-main justify-evenly item">
      {/* <div className="w-full h-1/8">
        <Logo />
      </div> */}
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div className="mb-5">
          <LogoHeader />
        </div>
        <div className="flex flex-row gap-4">
          {/* Game Form */}
          <Card className="p-6 bg-opacity-90">
            <div className="flex flex-col items-center justify-center">
              <div className="p-8 rounded-full bg-main">
                <FaGamepad className="text-5xl text-white" />
              </div>
            </div>
            <Input
              className="w-full bg-white border-none text-slate-400"
              variant="outlined"
              Placeholder="Code de la salle"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleLogin}
              className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 py-1 font-semibold"
            >
              Rejoindre
            </Button>

            <Button
              href="/lightning"
              className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-1 font-semibold"
            >
            Connexion lightning
            </Button>
          </Card>
          {/* Registration Form */}
          <Card className="p-6 bg-opacity-90">
            <div className="flex flex-col items-center justify-center">
              <div className="p-8 rounded-full bg-main">
                <FaLightbulb className="text-5xl text-white" />
              </div>
            </div>
            <Button
              href="/auth/signin"
              className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 py-1 font-semibold"
            >
              Se connecter
            </Button>
            <Button
              href="/auth/signup"
              className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-1 font-semibold"
            >
              S'inscrire
            </Button>

            <Button
              href="/manager"
              className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-1 font-semibold"
            >
             Manager de session
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}

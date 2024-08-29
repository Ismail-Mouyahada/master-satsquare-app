"use client";

import { Button, Card } from "flowbite-react";
import { FaGamepad, FaLightbulb } from "react-icons/fa";
import LogoHeader from "../components/LogoHeader/LogoHeader";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import { useEffect, useState } from "react";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import Image from "next/image";

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
    socket.on(
      "game:errorMessage",
      (message: Renderable | ValueFunction<Renderable, Toast>) => {
        toast.error(message);
      }
    );

    return () => {
      socket.off("game:errorMessage");
    };
  }, [socket]);

  return (
    <main className="flex flex-col w-full min-h-screen px-10 pt-10 survey-main justify-evenly item">
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div className="mb-5">
          <LogoHeader />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row md:flex-row sm:flex-col xs:flex-col">
          {/* Game Form */}
          <Card className="p-6 bg-opacity-90 bg-white">
            <div className="flex flex-col items-center justify-center">
              <div className="p-8 rounded-full bg-main">
                <FaGamepad className="text-5xl text-white" />
              </div>
            </div>
            <Button
              onClick={() => window.open("/home", "_blank")}
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 font-semibold text-center shadow-sm"
            >
              Rejoindre
            </Button>

            <Button
              onClick={() => window.open("/lightning", "_blank")}
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 font-semibold text-center shadow-sm"
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
              onClick={() => (window.location.href = "/auth/signin")}
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 font-semibold text-center shadow-sm"
            >
              Se connecter
            </Button>
            <Button
              onClick={() => (window.location.href = "/auth/signup")}
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 font-semibold text-center shadow-sm"
            >
              S'inscrire
            </Button>

            <Button
              onClick={() => window.open("/manager", "_blank")}
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 font-semibold text-center shadow-sm"
            >
              Manager de session
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}

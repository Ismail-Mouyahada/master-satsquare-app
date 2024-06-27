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
import Link from "next/link";
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
        <div className="flex gap-4 flex-col lg:flex-row  md:flex-row  sm:flex-col  xs:flex-col ">
          {/* Game Form */}
          <Card className="p-6 bg-opacity-90 bg-white">
            <div className="flex flex-col items-center justify-center">
              <div className="p-8 rounded-full bg-main">
                <FaGamepad className="text-5xl text-white" />
              </div>
            </div>
            <Link href="/home" target="_blank" rel="noopener noreferrer"

              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20   font-semibold text-center shadow-sm"
            >
              Rejoindre
            </Link>

            <Link href="lightning" target="_blank" rel="noopener noreferrer"

              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20   font-semibold text-center shadow-sm"
            >
              Connexion lightning
            </Link>
          </Card>
          {/* Registration Form */}
          <Card className="p-6 bg-opacity-90">
            <div className="flex flex-col items-center justify-center">
              <div className="p-8 rounded-full bg-main">
                <FaLightbulb className="text-5xl text-white" />
              </div>
            </div>
            <Link
              href="/auth/signin"
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20   font-semibold text-center shadow-sm"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/signup"
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20   font-semibold text-center shadow-sm"
            >
              S'inscrire
            </Link>

            <Link
              href="/manager" target="_blank" rel="noopener noreferrer"
              className="outline-none py-3 rounded-md ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20   font-semibold text-center shadow-sm"
            >
              Manager de session
            </Link>
          </Card>


        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import logo from "@/assets/logo-header.png";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useEffect } from "react";

import Room from "@/components/game/join/Room";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import Username from "@/components/game/join/Username/page";

export default function Home() {
  const { player } = usePlayerContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    const handleErrorMessage = (message: Renderable | ValueFunction<Renderable, Toast>) => {
      toast.error(message);
    };

    socket.on("game:errorMessage", handleErrorMessage);

    return () => {
      socket.off("game:errorMessage", handleErrorMessage);
    };
  }, [socket]);

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6" alt="logo" />

      {!player ? <Room /> : <Username />}
    </section>
  );
}

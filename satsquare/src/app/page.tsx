"use client"
import { Button, Card, FloatingLabel, } from "flowbite-react";
import Logo from "../components/Logo/Logo";
import { FaBeer, FaGamepad, FaLightbulb } from "react-icons/fa";
import LogoHeader from "../components/LogoHeader/LogoHeader";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import { useEffect } from "react";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";



export default function Home() {

  const { player, dispatch }  = usePlayerContext()
  const { socket }  = useSocketContext()

  useEffect(() => {
    socket.on("game:errorMessage", (message: Renderable | ValueFunction<Renderable, Toast>) => {
      toast.error(message)
    })

    return () => {
      socket.off("game:errorMessage")
    }
  }, [socket])

  return (
    <main className="flex flex-col w-full h-screen px-10 pt-10 survey-main">
      <div className="w-full h-1/8">
        <Logo />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div className="mb-5">  <LogoHeader /></div>
        <div className="flex flex-row gap-4">
          {/* Game Form */}
          <Card className="p-6 bg-opacity-90 ">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-[#4145c1] p-8 rounded-full">
                <FaGamepad className="text-5xl text-white" />
              </div>
            </div>

            <FloatingLabel className="w-full bg-white border-none text-slate-400" variant="outlined" label="Code de la session" />
            <Button className="outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 py-1">Rejoindre</Button>
          </Card>
          {/* Registration Form */}
          <Card className="p-6 bg-opacity-90 ">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-[#4145c1] p-8 rounded-full">
                <FaLightbulb className="text-5xl text-white" />
              </div>
            </div>
            <Button href="/api/auth/signin" className="outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 py-1">Se connecter</Button>
            <Button href="/signup" className="outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-1">S'inscrire</Button>
          </Card>
        </div>
      </div>
    </main>

  );
}

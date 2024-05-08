/* eslint-disable react/no-unescaped-entities */
import { Button, Card, FloatingLabel } from "flowbite-react";
import Logo from "./components/Logo/Logo";
import { FaBeer, FaGamepad, FaLightbulb } from "react-icons/fa";



export default function Home() {
  return (
    <main className="flex flex-col h-screen px-10 py-10 survey-main">
      <div className="w-full h-1/4">
        <Logo />
      </div>
      <div className="flex flex-row items-center justify-center w-full h-full gap-4">
        {/* Game Form */}
        <Card className="p-6 bg-opacity-90 ">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-[#4145c1] p-8 rounded-full">
              <FaGamepad className="text-5xl text-white" />
            </div>
          </div>

          <FloatingLabel className="w-full bg-white border-none" variant="outlined" label="Code de la session" />
          <Button className="outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 py-1">Rejoindre</Button>
        </Card>
        {/* Registration Form */}
        <Card className="p-6 bg-opacity-90 ">
        <div className="flex flex-col items-center justify-center">
            <div className="bg-[#4145c1] p-8 rounded-full">
              <FaLightbulb className="text-5xl text-white" />
            </div>
          </div>
          <Button className="outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-20 py-1">Se connecter</Button>
          <Button className="outline-none ring-[#6a6b74!important] bg-[#F8D99B] hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-1">S'inscrire</Button>
        </Card>
      </div>
    </main>

  );
}

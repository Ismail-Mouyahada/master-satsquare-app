"use client";

import { useEffect, useState } from "react";

import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
 
import Authlight from "@/components/Authlight";
import toast from "react-hot-toast";
 
export default function Home() {
  const { player } = usePlayerContext();
  const { socket } = useSocketContext();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('authenfyld login successfully using LNURL auth');
    }
  }, [isAuthenticated]);
 
 
  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen">
       
       
     
        <div className="flex items-center justify-center mb-4 w-full">
          <div className="flex flex-col items-center">
            <Authlight />
          </div>
        </div>
 

    
    </section>
  );
}
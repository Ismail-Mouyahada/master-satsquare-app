"use client";

import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayerContext } from "@/context/player";
import { useSocketContext } from "@/context/socket";
import toast from "react-hot-toast";
import { GAME_STATES, GAME_STATE_COMPONENTS } from "@/constants/db";
import GameWrapper from "@/components/game/GameWrapper/page";

export default function Game() {
  const { socket } = useSocketContext();
  const { player, dispatch } = usePlayerContext();
  const router = useRouter();

  const [etat, setEtat] = useState(GAME_STATES);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!player && isMounted) {
      router.replace("/");
    }
  }, [player, router, isMounted]);

  useEffect(() => {
    const handleGameStatus = (status: any) => {
      setEtat((prevEtat) => ({
        ...prevEtat,
        status: status,
        question: {
          ...prevEtat.question,
          current: status.question,
        },
      }));
    };

    const handleGameReset = () => {
      dispatch({ type: "LOGOUT" });
      setEtat(GAME_STATES);
      toast.success("Le jeu a été réinitialisé par l'hôte");
      router.replace("/");
    };

    socket.on("game:status", handleGameStatus);
    socket.on("game:reset", handleGameReset);

    return () => {
      socket.off("game:status", handleGameStatus);
      socket.off("game:reset", handleGameReset);
    };
  }, [socket, dispatch, router]);

  const handleNext = () => {
    throw new Error("Function not implemented.");
  };

<<<<<<< HEAD
  if (!isMounted) {
    return null; // Avoid rendering on the server
  }
=======
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("gameState");
      if (savedState) {
        setEtat(JSON.parse(savedState));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gameState", JSON.stringify(etat));
    }
  }, [etat]);
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b

  return (
    <GameWrapper textNext="Suivant" onNext={handleNext} manager={false}>
      {GAME_STATE_COMPONENTS[etat.status.name] &&
        createElement(GAME_STATE_COMPONENTS[etat.status.name], {
          data: etat.status.data,
        })}
    </GameWrapper>
  );
}

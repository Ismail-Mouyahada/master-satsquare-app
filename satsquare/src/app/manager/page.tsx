"use client";

import React, { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";
import { useSocketContext } from "@/context/socket";
import GameWrapper from "@/components/game/GameWrapper/page";
import ManagerPassword from "@/components/ManagerPassword";
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "../constants/db";

interface GameStatus {
  name: string;
  data: any;
  question: any;
}

export default function Manager() {
  const { Canvas } = useQRCode();
  const { socket } = useSocketContext();
  const [nextText, setNextText] = useState("Commencer");
  const [state, setState] = useState(GAME_STATES);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const savedState = localStorage.getItem("gameState");
      const savedInviteCode = localStorage.getItem("inviteCode");

      if (savedState) {
        setState(JSON.parse(savedState));
      }
      if (savedInviteCode) {
        setInviteCode(savedInviteCode);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    const handleGameStatus = (status: GameStatus) => {
      if (!status || !status.name) {
        console.error("Invalid status received:", status);
        return;
      }

      console.log("Received game status:", status); // Debugging log
      setState((prevState) => {
        const newState = {
          ...prevState,
          status: {
            ...prevState.status,
            name: status.name,
            data: status.data,
          },
          question: {
            ...prevState.question,
            current: status.question,
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("gameState", JSON.stringify(newState));
        }
        return newState;
      });
    };

    const handleInviteCode = (roomInvite: string) => {
      console.log("Received invite code:", roomInvite); // Debugging log
      setInviteCode(roomInvite);
      if (typeof window !== "undefined") {
        localStorage.setItem("inviteCode", roomInvite);
      }

      setState((prevState) => {
        const newState = {
          ...prevState,
          created: true,
          status: {
            ...prevState.status,
            data: {
              ...prevState.status.data,
              inviteCode: roomInvite,
            },
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("gameState", JSON.stringify(newState));
        }
        return newState;
      });
    };

    socket.on("game:status", handleGameStatus);
    socket.on("manager:inviteCode", handleInviteCode);

    return () => {
      socket.off("game:status", handleGameStatus);
      socket.off("manager:inviteCode", handleInviteCode);
    };
  }, [socket]);

  const handleCreate = () => {
    socket.emit("manager:createRoom");
  };

  const handleSkip = () => {
    setNextText("Suivant");

    switch (state.status.name) {
      case "SHOW_ROOM":
        socket.emit("manager:startGame");
        break;
      case "SELECT_ANSWER":
        socket.emit("manager:abortQuiz");
        break;
      case "SHOW_RESPONSES":
        socket.emit("manager:showLeaderboard");
        break;
      case "SHOW_LEADERBOARD":
        socket.emit("manager:nextQuestion");
        break;
      default:
        console.log("No matching case for state:", state.status.name);
        socket.emit("manager:startGame");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gameState");
      localStorage.removeItem("inviteCode");
    }
    setState({
      ...GAME_STATES,
      status: {
        ...GAME_STATES.status,
        name: "SHOW_ROOM",
      },
    });
    setInviteCode(null);
  };

  return (
    <>
      {!state.created ? (
        <div>
          <ManagerPassword />
        </div>
      ) : (
        <GameWrapper textNext={nextText} onNext={handleSkip} manager>
          {state.status.name === "SHOW_ROOM" && (
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center items-center bg-primary p-8 my-2 rounded-md">
                <Canvas
                  text={inviteCode || ""}
                  options={{
                    type: "image/jpeg",
                    quality: 0.3,
                    errorCorrectionLevel: "M",
                    margin: 0,
                    scale: 4,
                    width: 200,
                    color: {
                      light: "#3037ce",
                      dark: "#ffffffff",
                    },
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold text-center text-slate-500 mb-4 bg-action p-8 rounded-md ">
                Room ID: {inviteCode}
              </h3>
            </div>
          )}
          {GAME_STATE_COMPONENTS_MANAGER[state.status.name] &&
            React.createElement(
              GAME_STATE_COMPONENTS_MANAGER[state.status.name],
              {
                data: state.status.data,
              }
            )}
        </GameWrapper>
      )}
    </>
  );
}

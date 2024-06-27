"use client";

import ManagerPassword from "@/components/ManagerPassword";
import GameWrapper from "@/components/game/GameWrapper/page";
import { useSocketContext } from "@/context/socket";
import React, { useEffect, useState } from "react";
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "../constants/db";
import { useQRCode } from "next-qrcode";
import { FaSignOutAlt } from "react-icons/fa";

export default function Manager() {
  const { Canvas } = useQRCode();
  const { socket } = useSocketContext();
  const [nextText, setNextText] = useState("Commencer");
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("gameState");
      return savedState
        ? JSON.parse(savedState)
        : {
            ...GAME_STATES,
            status: {
              ...GAME_STATES.status,
              name: "SHOW_ROOM",
            },
          };
    }
    return {
      ...GAME_STATES,
      status: {
        ...GAME_STATES.status,
        name: "SHOW_ROOM",
      },
    };
  });
  const [inviteCode, setInviteCode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("inviteCode");
    }
    return null;
  });

  useEffect(() => {
    const handleGameStatus = (status: {
      name: any;
      data: any;
      question: any;
    }) => {
      setState((prevState: { status: any; question: any }) => {
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

    const handleInviteCode = (
      roomInvite: React.SetStateAction<string | null>
    ) => {
      if (typeof window !== "undefined") {
        setInviteCode(roomInvite);
        localStorage.setItem("inviteCode", roomInvite as string);
      }
      setState((prevState: { status: { data: any } }) => {
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
        break;
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
        <>
          <ManagerPassword />
          <button onClick={handleCreate}>Créer une salle</button>
        </>
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
              <button
                onClick={handleLogout}
                className="mt-4 p-4 bg-red-500 text-white rounded"
              >
                <FaSignOutAlt className="scale-150" />
              </button>
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

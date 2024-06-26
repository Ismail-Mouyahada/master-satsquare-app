"use client";
import ManagerPassword from "@/components/ManagerPassword";
import GameWrapper from "@/components/game/GameWrapper/page";
import { useSocketContext } from "@/context/socket";
import React, { useEffect, useState } from "react";
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "../constants/db";
import { useQRCode } from 'next-qrcode';
import { FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

export default function Manager() {
  const { Canvas } = useQRCode();
  const { socket } = useSocketContext();
  const [nextText, setNextText] = useState("Commencer");
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : {
      ...GAME_STATES,
      status: {
        ...GAME_STATES.status,
        name: "SHOW_ROOM",
      },
    };
  });
  const [inviteCode, setInviteCode] = useState(() => localStorage.getItem('inviteCode'));

  useEffect(() => {
    const handleGameStatus = (status: { name: any; data: any; question: any; }) => {
      console.log("Received game status:", status); // Debugging log
      setState((prevState: { status: any; question: any; }) => {
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
        localStorage.setItem('gameState', JSON.stringify(newState));
        return newState;
      });
    };

    const handleInviteCode = (roomInvite: React.SetStateAction<string | null>) => {
      console.log("Received invite code:", roomInvite); // Debugging log
      if (typeof roomInvite === 'string') {
        setInviteCode(roomInvite);
        localStorage.setItem('inviteCode', roomInvite);
      }
      setState((prevState: { status: { data: any; }; }) => {
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
        localStorage.setItem('gameState', JSON.stringify(newState));
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
    console.log("Creating room..."); // Debugging log
    socket.emit("manager:createRoom");
  };

  const handleSkip = () => {
    console.log("Handling skip... Current state:", state); // Debugging log
    setNextText("Suivant");

    switch (state.status.name) {
      case "SHOW_ROOM":
        console.log("Starting game..."); // Debugging log
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
    }
  };

  const handleLogout = () => {
 
    localStorage.removeItem('gameState');
    localStorage.removeItem('inviteCode');
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
              <div className="flex justify-center items-center bg-slate-50 p-8 my-2 rounded-md">
                <Canvas
                  text={inviteCode || ""}
                  options={{
                    type: 'image/jpeg',
                    quality: 0.3,
                    errorCorrectionLevel: 'M',
                    margin: 0,
                    scale: 4,
                    width: 200,
                    color: {
                      light: '#ffffff',
                      dark: '#222629ff',
                    },
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold text-center text-slate-600 m-4 bg-action px-8 py-8 rounded-md ">
                Room ID: {inviteCode}
              </h3>
         

            
            </div>
          )}
          {GAME_STATE_COMPONENTS_MANAGER[state.status.name] &&
            React.createElement(GAME_STATE_COMPONENTS_MANAGER[state.status.name], {
              data: state.status.data,
            })}
        </GameWrapper>
      )}
    </>
  );
}

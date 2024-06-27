"use client";

<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useQRCode } from 'next-qrcode';
import { useSocketContext } from "@/context/socket";
import GameWrapper from "@/components/game/GameWrapper/page";
import ManagerPassword from "@/components/ManagerPassword";
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "../constants/db";
=======
import ManagerPassword from "@/components/ManagerPassword";
import GameWrapper from "@/components/game/GameWrapper/page";
import { useSocketContext } from "@/context/socket";
import React, { useEffect, useState } from "react";
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "../constants/db";
import { useQRCode } from "next-qrcode";
import { FaSignOutAlt } from "react-icons/fa";
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b

export default function Manager() {
  const { Canvas } = useQRCode();
  const { socket } = useSocketContext();
  const [nextText, setNextText] = useState("Commencer");
<<<<<<< HEAD
  const [state, setState] = useState(GAME_STATES);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const savedState = localStorage.getItem('gameState');
      const savedInviteCode = localStorage.getItem('inviteCode');

      if (savedState) {
        setState(JSON.parse(savedState));
      }
      if (savedInviteCode) {
        setInviteCode(savedInviteCode);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    const handleGameStatus = (status: { name: any; data: any; question: any; }) => {
      console.log("Received game status:", status); // Debugging log
      setState((prevState) => {
=======
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
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
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
<<<<<<< HEAD
        if (typeof window !== 'undefined') {
          localStorage.setItem('gameState', JSON.stringify(newState));
=======
        if (typeof window !== "undefined") {
          localStorage.setItem("gameState", JSON.stringify(newState));
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
        }
        return newState;
      });
    };

<<<<<<< HEAD
    const handleInviteCode = (roomInvite: string) => {
      console.log("Received invite code:", roomInvite); // Debugging log
      setInviteCode(roomInvite);
      if (typeof window !== 'undefined') {
        localStorage.setItem('inviteCode', roomInvite);
      }

      setState((prevState) => {
=======
    const handleInviteCode = (
      roomInvite: React.SetStateAction<string | null>
    ) => {
      if (typeof window !== "undefined") {
        setInviteCode(roomInvite);
        localStorage.setItem("inviteCode", roomInvite as string);
      }
      setState((prevState: { status: { data: any } }) => {
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
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
<<<<<<< HEAD
        if (typeof window !== 'undefined') {
          localStorage.setItem('gameState', JSON.stringify(newState));
=======
        if (typeof window !== "undefined") {
          localStorage.setItem("gameState", JSON.stringify(newState));
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
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
<<<<<<< HEAD
        socket.emit("manager:startGame");
        console.log("No matching case for state:", state.status.name);  
=======
        break;
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
    }
  };

  const handleLogout = () => {
<<<<<<< HEAD
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gameState');
      localStorage.removeItem('inviteCode');
=======
    if (typeof window !== "undefined") {
      localStorage.removeItem("gameState");
      localStorage.removeItem("inviteCode");
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
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
<<<<<<< HEAD
        <div>
          <ManagerPassword />
        </div>
=======
        <>
          <ManagerPassword />
          <button onClick={handleCreate}>Créer une salle</button>
        </>
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
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
<<<<<<< HEAD
=======
              <button
                onClick={handleLogout}
                className="mt-4 p-4 bg-red-500 text-white rounded"
              >
                <FaSignOutAlt className="scale-150" />
              </button>
>>>>>>> 5fcdb68c7599f107d3a7513047445fb37443f27b
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

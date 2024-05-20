"use client"
import ManagerPassword from "@/components/ManagerPassword";
import GameWrapper from "@/components/game/GameWrapper/page";
import { useSocketContext } from "@/context/socket";
import React, { useEffect, useState } from "react";
import { GAME_STATES, GAME_STATE_COMPONENTS_MANAGER } from "../constants/db";

export default function Manager() {
  const { socket } = useSocketContext();
  const [nextText, setNextText] = useState("Start");
  const [state, setState]: any = useState({
    ...GAME_STATES,
    status: {
      ...GAME_STATES.status,
      name: "SHOW_ROOM",
    }
  });

  useEffect(() => {
    socket.on("game:status", (status) => {
      setState({
        ...state,
        status: status,
        question: {
          ...state.question,
          current: status.question,
        },
      })
    })

    socket.on("manager:inviteCode", (roomInvite) => {
      setState({
        ...state,
        created: true,
        status: {
          ...state.status,
          data: {
            ...state.status.data,
            inviteCode: roomInvite,
          },
        },
      })
    })

    return () => {
      socket.off("game:status")
      socket.off("manager:inviteCode")
    }
  }, [state])
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

  return (
    <>
      {!state.created ? (
        < >
          <ManagerPassword />
        </>
      ) : (
        <>
          <GameWrapper textNext={nextText} onNext={handleSkip} manager>
            {GAME_STATE_COMPONENTS_MANAGER[state.status.name] &&
              React.createElement(GAME_STATE_COMPONENTS_MANAGER[state.status.name], {
                data: state.status.data,
              })}
          </GameWrapper>
        </>
      )}
    </>
  );
}

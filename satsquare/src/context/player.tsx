"use client"
import React from "react"
import { createContext, useContext, useReducer } from "react"
export const PlayerContext = createContext({
  player: null
})

export function playerReducer(state:any, action:any) {
  switch (action.type) {
    case "JOIN":
      return { player: { ...state.player, room: action.payload } }
    case "LOGIN":
      return {
        player: {
          ...state.player,
          username: action.payload,
          points: 0,
        },
      }
    case "UPDATE":
      return { player: { ...state.player, ...action.payload } }
    case "LOGOUT":
      return { player: null }
    default:
      return state
  }
}

export const PlayerContextProvider = ({ children }:any) => {
  const [state, dispatch] = useReducer(playerReducer, {
    player: null,
  })

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayerContext() {
  const context : any = useContext(PlayerContext)

  if (!context) {
    throw Error("usePlayerContext must be used inside an PlayerContextProvider")
  }

  return context
}

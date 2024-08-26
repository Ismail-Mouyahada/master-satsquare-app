"use client"
import { WEBSOCKET_URL } from "@/constants/db";
import { createContext, useContext, useState } from "react";
import React from "react";
import { io, Socket } from "socket.io-client";
 
// Définir le type pour le socket
export const socket: Socket = io(WEBSOCKET_URL || "", {
  path: "/ws/",
  // addTrailingSlash: false,
  transports: ["websocket"],
});

export const SocketContext = createContext<Socket | null>(null);

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export function useSocketContext(): { socket: Socket } {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used inside a SocketContextProvider");
  }
  return { socket: context };
}

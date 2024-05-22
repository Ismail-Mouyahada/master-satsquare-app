"use client"; // Directive pour indiquer que ce fichier est un composant client

import { SessionProvider } from "next-auth/react";
import { SocketContextProvider } from "@/context/socket";
import { PlayerContextProvider } from "@/context/player";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Toaster } from "react-hot-toast";

const Providers = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return (
    <SessionProvider session={session}>
      <SocketContextProvider>
        <PlayerContextProvider>
          <AppRouterCacheProvider>
            {children}
            <Toaster />
          </AppRouterCacheProvider>
        </PlayerContextProvider>
      </SocketContextProvider>
    </SessionProvider>
  );
};

export default Providers;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { SocketContextProvider } from "@/context/socket";
import { PlayerContextProvider } from "@/context/player";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SATSQUARE App",
  description: "Application dedié pour aider les associations",
};

export default function RootLayout({ children, Component, pageProps }: Readonly<{ children: React.ReactNode; Component: React.ReactNode;pageProps: React.ReactNode; }>) {
  return (
    <html>
      <head>
        <ThemeModeScript />
      </head>
      <SocketContextProvider>
        <PlayerContextProvider>
          <AppRouterCacheProvider>

            <body>{children}</body>
          </AppRouterCacheProvider>
        </PlayerContextProvider>
      </SocketContextProvider>
    </html>
  );
}



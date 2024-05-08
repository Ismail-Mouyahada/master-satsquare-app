import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SATSQUARE App",
  description: "Application dedié pour aider les associations",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html>
      <head>
        <ThemeModeScript />
      </head>
      <AppRouterCacheProvider>
         <body>{children}</body>
      </AppRouterCacheProvider>
    </html>
  );
}

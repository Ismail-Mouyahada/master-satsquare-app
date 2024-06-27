import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SATSQUARE App",
  description: "Application dédiée pour aider les associations",
};

export default function RootLayout({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps: any;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="16x16." href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Application dédiée pour aider les associations" />
        <title>Sat Square App</title>
      </head>
      <body className={`survey-main ${inter.className}`}>
        <Providers session={pageProps?.session}>
          <ThemeModeScript />
          {children}
        </Providers>
      </body>
    </html>
  );
}

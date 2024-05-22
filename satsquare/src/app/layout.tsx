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
    <html>
      <head></head>
      <body className="survey-main">
        <Providers session={pageProps?.session}>{children}</Providers>
      </body>
    </html>
  );
}

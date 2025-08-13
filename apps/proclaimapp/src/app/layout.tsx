import "@/frontend/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/frontend/components/ui/sonner";
import { env } from "@/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "proClaim",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set theme on server side to prevent flash
  const theme = env.BANK === "JP" ? "jp-theme" : "citi-theme";

  return (
    <html lang="en" className="h-full" data-theme={theme}>
      <body className={`font-sans ${inter.variable} h-full`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

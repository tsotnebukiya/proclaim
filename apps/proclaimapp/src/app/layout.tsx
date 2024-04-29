import "@/frontend/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/frontend/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Proclaim",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans ${inter.variable} h-full`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

import "@/frontend/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/frontend/components/ui/sonner";
import { ThemeProvider } from "@/frontend/components/ThemeProvider";
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
  return (
    <html lang="en" className="h-full">
      <body className={`font-sans ${inter.variable} h-full`}>
        <ThemeProvider bankTheme={env.BANK}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

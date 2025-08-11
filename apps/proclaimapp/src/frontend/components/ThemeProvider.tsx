"use client";

import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  bankTheme: string;
}

export function ThemeProvider({ children, bankTheme }: ThemeProviderProps) {
  useEffect(() => {
    // Set the theme class on the document element based on bank theme prop
    const theme = bankTheme === "JP" ? "jp-theme" : "citi-theme";
    document.documentElement.setAttribute("data-theme", theme);
  }, [bankTheme]);

  return <>{children}</>;
}

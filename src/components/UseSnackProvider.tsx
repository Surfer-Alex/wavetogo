"use client";

import { SnackbarProvider } from "notistack";

export function UseSnackProvider({ children }: { children: React.ReactNode }) {
  return <SnackbarProvider maxSnack={2}>{children}</SnackbarProvider>;
}

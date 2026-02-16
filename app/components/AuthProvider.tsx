"use client";

import { AuthProvider as Provider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}


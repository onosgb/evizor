"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Protect routes - redirect based on authentication status
    if (!isLoading) {
      const publicRoutes = ["/login"];
      const isPublicRoute = publicRoutes.includes(pathname || "");

      // If authenticated and on login, redirect to dashboard
      if (isAuthenticated && pathname === "/login") {
        router.push("/");
        return;
      }

      // If not authenticated and trying to access protected routes
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


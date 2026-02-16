"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../lib/services";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logoutStore = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const state = useAuthStore.getState();
      const accessToken = state.accessToken;
      const isAuth = !!accessToken;

      // Update isAuthenticated if token exists but state doesn't match
      if (accessToken && !state.isAuthenticated) {
        useAuthStore.setState({ isAuthenticated: true });
      } else if (!accessToken && state.isAuthenticated) {
        useAuthStore.setState({ isAuthenticated: false });
      }

      setLoading(false);
    };

    checkAuth();
  }, [setLoading]);

  useEffect(() => {
    // Protect routes - redirect based on authentication status
    if (!isLoading) {
      const publicRoutes = ["/login", "/", "/landing", '/forgot-password', '/reset-password'];
      const isPublicRoute = publicRoutes.includes(pathname || "");
      const isProfileRoute = pathname?.startsWith("/profile");

      // Check profile completion status
      const { profileCompleted, user } = useAuthStore.getState();

      // If authenticated
      if (isAuthenticated) {
        // Enforce profile completion (skip for ADMIN)
        if (!profileCompleted && !isProfileRoute && user?.role !== "ADMIN") {
          router.push("/profile");
          return;
        }

        // If authenticated and on login or landing, redirect to dashboard (only if profile is complete)
        if (
          profileCompleted &&
          (pathname === "/login" || pathname === "/" || pathname === "/landing")
        ) {
          router.push("/dashboard");
          return;
        }
      }

      // If not authenticated and trying to access protected routes
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails, clear local state
      console.error("Logout error:", error);
      logoutStore();
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, isLoading }}>
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

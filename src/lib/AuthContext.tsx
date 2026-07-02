"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (email?: string, password?: string, fullName?: string) => Promise<void>;
  isAuthenticated: boolean;
}

type AuthResponse = {
  user?: User | null;
  isAuthenticated?: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await response.json()) as AuthResponse;
        if (mounted) setUser(data.user || null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const currentReturnTo = () => {
    if (typeof window === "undefined") return "/";
    return `${window.location.pathname}${window.location.search}`;
  };

  const login = async () => {
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(currentReturnTo())}`;
  };

  const register = async () => {
    window.location.href = `/api/auth/signup?returnTo=${encodeURIComponent(currentReturnTo())}`;
  };

  const logout = () => {
    setUser(null);
    window.location.href = "/api/auth/logout";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
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

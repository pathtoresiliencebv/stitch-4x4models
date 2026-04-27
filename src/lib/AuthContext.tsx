'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = 'https://stimulating-growth-suite-ai.base44.app/api';
const APP_ID = '699871557dfcaafa02868052';
const API_KEY = '4d740112ee914feea4c1d567d68ce926';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('4x4_token');
      if (token) {
        // Verify token with backend
        const res = await fetch(`${API_URL}/auth/session`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-app-id': APP_ID,
            'x-api-key': API_KEY,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('4x4_user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('4x4_token');
          localStorage.removeItem('4x4_user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': APP_ID,
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('4x4_token', data.token);
      localStorage.setItem('4x4_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': APP_ID,
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await res.json();
      localStorage.setItem('4x4_token', data.token);
      localStorage.setItem('4x4_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('4x4_token');
    localStorage.removeItem('4x4_user');
    setUser(null);
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

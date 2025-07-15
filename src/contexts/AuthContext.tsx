import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (username: string, newPassword: string) => Promise<{success: boolean, message: string}>;
}

interface DecodedToken extends User {
  id: string;
  iat: number;
  exp: number;
}


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setCurrentUser({
            id: decodedToken.id,
            name: decodedToken.name,
            username: decodedToken.username,
            role: decodedToken.role,
          });
        } else {
           sessionStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        const decodedToken: DecodedToken = jwtDecode(data.token);
        setCurrentUser({
          id: decodedToken.id,
          name: decodedToken.name,
          username: decodedToken.username,
          role: decodedToken.role,
        });
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('token');
  };

  const resetPassword = async (username: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    try {
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: newPassword }),
        });
        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (error) {
        console.error("Password reset failed:", error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  const value = { currentUser, loading, login, logout, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

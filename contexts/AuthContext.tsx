import React, { createContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  resetPassword: (username: string, newPassword: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (username: string, password: string): boolean => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      const { password, ...userToStore } = user;
      setCurrentUser(userToStore as User);
      sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const resetPassword = (username: string, newPassword: string): boolean => {
    const userIndex = mockUsers.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex > -1) {
      mockUsers[userIndex].password = newPassword;
      return true;
    }
    return false;
  };

  const value = { currentUser, login, logout, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

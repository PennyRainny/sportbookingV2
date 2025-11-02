"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string, type?: 'user' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password?: string, type: 'user' | 'admin' = 'user') => {
    if (type === 'admin') {
      // Mock admin login
      setUser({
        id: 'admin-1',
        name: 'Admin User',
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        type: 'admin',
      });
    } else {
      // Mock LINE login
      setUser({
        id: 'user-' + Date.now(),
        name: 'Student User',
        email: email || 'student@spu.ac.th',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
        type: 'user',
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

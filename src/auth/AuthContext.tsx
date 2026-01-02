// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  accessToken: string | null;
  idToken: string | null; // add idToken
  login: (accessToken: string, idToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  const login = (access: string, id: string) => {
    setAccessToken(access);
    setIdToken(id);
  };

  const logout = () => {
    setAccessToken(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, idToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

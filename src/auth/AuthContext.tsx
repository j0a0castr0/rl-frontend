// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  accessToken: string | null;
  idToken: string | null;
  login: (accessToken: string, idToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const ACCESS_TOKEN_KEY = 'accessToken';
const ID_TOKEN_KEY = 'idToken';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // 🔄 Restore tokens on refresh
  useEffect(() => {
    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedId = localStorage.getItem(ID_TOKEN_KEY);

    if (storedAccess && storedId) {
      setAccessToken(storedAccess);
      setIdToken(storedId);
    }
  }, []);

  const login = (access: string, id: string) => {
    setAccessToken(access);
    setIdToken(id);
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(ID_TOKEN_KEY, id);
  };

  const logout = () => {
    setAccessToken(null);
    setIdToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ID_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        idToken,
        login,
        logout,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

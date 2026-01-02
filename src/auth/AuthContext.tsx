import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  accessToken: string | null;
  idToken: string | null;
  login: (accessToken: string, idToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  idToken: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [idToken, setIdToken] = useState<string | null>(() => localStorage.getItem('idToken'));

  const login = (access: string, id: string) => {
    setAccessToken(access);
    setIdToken(id);
    localStorage.setItem('accessToken', access);
    localStorage.setItem('idToken', id);
  };

  const logout = () => {
    setAccessToken(null);
    setIdToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
  };

  return (
    <AuthContext.Provider value={{ accessToken, idToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

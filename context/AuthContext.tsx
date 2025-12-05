// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Määra konteksti tüüp
interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => void;
}

// Loo kontekst
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Loo konteksti pakkuja (Provider) komponent
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<Record<string, string>>({ 'user@user.ee': 'user' }); // email: password

  const login = (email: string, password: string) => {
    if (users[email] && users[email] === password) {
      setIsLoggedIn(true);
      setUsername(email.split('@')[0]);
      return true;
    }
    return false;
  };

  const register = (email: string, password: string) => {
    setUsers(prev => ({ ...prev, [email]: password }));
    setIsLoggedIn(true);
    setUsername(email.split('@')[0]);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Loo custom hook, et hõlpsasti konteksti kasutada
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
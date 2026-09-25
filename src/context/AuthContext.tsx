import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../utils/axios';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: { name: string, email: string, password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Funkcja pomocnicza aktualizująca stan Reacta i zmienną w Axios
  const updateAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  // 1. Ciche odświeżenie sesji podczas startu aplikacji (F5)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        updateAccessToken(response.data.accessToken);
        setUser(response.data.user);
      } catch {
        updateAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. Funkcja logowania
  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, user } = response.data;

    updateAccessToken(accessToken);
    setUser(user);
  };

  // 3. Funkcja wylogowania
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      updateAccessToken(null);
      setUser(null);
    }
  };

  //4. Funkcja rejestracji
  const register = async (credentials: { name: string, email: string, password: string }) => {
    await api.post('/api/register', credentials);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        isAuthenticated: !!user && !!accessTokenState,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Dedykowany Hook do łatwego używania kontekstu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być użyte wewnątrz AuthProvider');
  }
  return context;
};
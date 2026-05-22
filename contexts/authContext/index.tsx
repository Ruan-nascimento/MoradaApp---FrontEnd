import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  isLoadingToken: boolean;
  saveToken: (token: string) => Promise<void>;
  removeToken: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "morada_token";

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  async function loadToken() {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.log("Erro ao carregar token:", error);
    } finally {
      setIsLoadingToken(false);
    }
  }

  async function saveToken(token: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      setToken(token);
    } catch (error) {
      console.log("Erro ao salvar token:", error);
      throw error;
    }
  }

  async function removeToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
    } catch (error) {
      console.log("Erro ao remover token:", error);
      throw error;
    }
  }

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isLoadingToken,
        saveToken,
        removeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
import { API_URL } from "../utils/exports";

interface SignInResponse {
  success: boolean;
  token: string;
  message?: string;
  user?: unknown;
}

interface SignUpResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: unknown;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

export function useUser() {
  async function signIn(email: string, password: string): Promise<SignInResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      if (!data.token) {
        throw new Error("Token de autenticação não encontrado na resposta");
      }

      return data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  async function signUp({
    name,
    email,
    password,
  }: SignUpProps): Promise<SignUpResponse> {
    try {
      const response = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      return data;
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      throw error;
    }
  }

  return {
    signIn,
    signUp,
  };
}
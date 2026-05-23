import { API_URL, API_URL_REAL } from "../utils/exports";

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

export interface GetUserAuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    reservas: {
      data: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      nome: string;
      hora: string;
      userId: string;
    }[];
  };
  success: boolean;
  message?: string;
}

export function useUser() {
  async function signIn(email: string, password: string): Promise<SignInResponse> {
    try {
      const response = await fetch(`${API_URL_REAL}/login`, {
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
      const response = await fetch(`${API_URL_REAL}/cadastro`, {
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

  async function getUserAuth(token: string): Promise<GetUserAuthResponse> {
  try {
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_URL_REAL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });


    const data: GetUserAuthResponse = await response.json();

    console.log("Resposta da API /me:", data);

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar informações do usuário");
    }

    if (!data.success) {
      throw new Error(data.message || "Erro ao buscar informações do usuário");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw error;
  }
}

  return {
    signIn,
    signUp,
    getUserAuth,
  };
}
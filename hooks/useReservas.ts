import { useAuth } from "../contexts/authContext";
import { API_URL_REAL } from "../utils/exports";

export interface CriarReservaResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    imoveisId: string;
    userId: string;
    chekIn: string;
    chekOut: string;
    finalValue: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ListarReservasResponse {
  success: boolean;
  data: {
    id: string;
    imoveisId: string;
    userId: string;
    chekIn: string;
    chekOut: string;
    finalValue: number;
    pixCode?: string;
    pixQrCodeBase64?: string;
    createdAt: string;
    imoveis: {
      id: string;
      title: string;
      photo: string;
      city: string;
      uf: string;
      price: number;
    };
  }[];
}

export function useReservas() {
  const { token } = useAuth();

  async function criarReserva(
    imoveisId: string,
    chekIn: string,
    chekOut: string
  ): Promise<CriarReservaResponse> {
    if (!token) {
      throw new Error("Usuário não autenticado. Por favor, faça login.");
    }

    try {
      const response = await fetch(`${API_URL_REAL}/criar-reserva`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imoveisId,
          chekIn,
          chekOut,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar reserva");
      }

      return data;
    } catch (error) {
      console.error("Erro em criarReserva hook:", error);
      throw error;
    }
  }

  async function listarReservas(): Promise<ListarReservasResponse> {
    if (!token) {
      throw new Error("Usuário não autenticado. Por favor, faça login.");
    }

    try {
      const response = await fetch(`${API_URL_REAL}/listar-reservas`, {
        method: "POST", // Rota do backend está como POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao listar reservas");
      }

      return data;
    } catch (error) {
      console.error("Erro em listarReservas hook:", error);
      throw error;
    }
  }

  async function cancelarReserva(id: string): Promise<{ success: boolean; message: string }> {
    if (!token) {
      throw new Error("Usuário não autenticado. Por favor, faça login.");
    }

    try {
      const response = await fetch(`${API_URL_REAL}/cancelar-reserva`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cancelar reserva");
      }

      return data;
    } catch (error) {
      console.error("Erro em cancelarReserva hook:", error);
      throw error;
    }
  }

  async function confirmarReserva(payload: {
    imoveisId: string;
    chekIn: string;
    chekOut: string;
    finalValue: number;
    abacatePayId: string;
    pixCode?: string;
    pixQrCodeBase64?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    if (!token) {
      throw new Error("Usuário não autenticado. Por favor, faça login.");
    }

    try {
      const response = await fetch(`${API_URL_REAL}/confirmar-reserva`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao confirmar reserva");
      }

      return data;
    } catch (error) {
      console.error("Erro em confirmarReserva hook:", error);
      throw error;
    }
  }

  return {
    criarReserva,
    confirmarReserva,
    listarReservas,
    cancelarReserva,
  };
}

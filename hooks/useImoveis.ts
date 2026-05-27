import { useState, useCallback, useRef } from "react";
import { API_URL_REAL } from "../utils/exports";
import { Imovel } from "../utils/interfaces/imoveis";

interface UseImoveisReturn {
  imoveis: Imovel[];
  loading: boolean;
  error: string | null;
  fetchImoveis: (refresh?: boolean) => Promise<void>;
  refresh: () => void;
}

export function useImoveis(): UseImoveisReturn {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isFetchingRef = useRef(false);

  const fetchImoveis = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Puxa todos os imóveis de uma vez (limit alto)
      const response = await fetch(`${API_URL_REAL}/imoveis?page=1&limit=1000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const textData = await response.text();
      let data;
      try {
        data = JSON.parse(textData);
      } catch (e) {
        throw new Error("A API não retornou um JSON válido.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar os imóveis");
      }

      const newImoveis: Imovel[] = Array.isArray(data) ? data : data.data || [];
      
      // Como estamos trazendo todos de uma vez, simplesmente substituímos a lista
      setImoveis(newImoveis);
      
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao carregar imóveis");
      console.error("Erro em fetchImoveis:", err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchImoveis(true);
  }, [fetchImoveis]);

  return {
    imoveis,
    loading,
    error,
    fetchImoveis,
    refresh,
  };
}

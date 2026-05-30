import { useState, useEffect, useRef } from "react";
import { API_URL_REAL } from "../utils/exports";
import { ImovelDetalhado, ImovelDetalhadoResponse } from "../utils/interfaces/imoveis";


const cache = new Map<string, ImovelDetalhado>();


interface UseImovelDetalhesReturn {
  imovel: ImovelDetalhado | null;
  loading: boolean;
  error: string | null;
}


export function useImovelDetalhes(id: string): UseImovelDetalhesReturn {
  const [imovel, setImovel] = useState<ImovelDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!id) return;

    const cached = cache.get(id);

    if (cached) {
      setImovel(cached);
      setLoading(false);
      return;
    }

    async function fetchImovel() {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL_REAL}/imoveis/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data: ImovelDetalhadoResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Erro ao buscar imóvel");
        }

        cache.set(id, data.data);
        setImovel(data.data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido ao buscar imóvel");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }

    fetchImovel();
  }, [id]);

  return { imovel, loading, error };
}

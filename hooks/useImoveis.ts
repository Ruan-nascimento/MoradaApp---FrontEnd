import { useState, useCallback, useRef } from "react";
import { API_URL_REAL } from "../utils/exports";
import { Imovel, PaginatedImoveisResponse } from "../utils/interfaces/imoveis";

const PAGE_SIZE = 30;

interface UseImoveisReturn {
  imoveis: Imovel[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => void;
}

export function useImoveis(): UseImoveisReturn {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(async (page: number) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL_REAL}/imoveis?page=${page}&limit=${PAGE_SIZE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const textData = await response.text();
      let data: PaginatedImoveisResponse;
      try {
        data = JSON.parse(textData);
      } catch (e) {
        throw new Error("A API não retornou um JSON válido.");
      }

      if (!response.ok) {
        throw new Error((data as any).message || "Erro ao carregar os imóveis");
      }

      const newImoveis: Imovel[] = Array.isArray(data) ? data : data.data || [];

      // Substitui os imóveis — não acumula
      setImoveis(newImoveis);
      setCurrentPage(page);

      // Calcula total de páginas a partir do total retornado pela API
      const total = (data as PaginatedImoveisResponse).total ?? 0;
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      setTotalPages(pages);

      const nextPageExists = (data as PaginatedImoveisResponse).hasNextPage ?? page < pages;
      setHasNextPage(nextPageExists);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao carregar imóveis");
      console.error("Erro em fetchImoveis:", err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        fetchPage(page);
      }
    },
    [fetchPage, totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      fetchPage(currentPage + 1);
    }
  }, [fetchPage, currentPage, hasNextPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchPage(currentPage - 1);
    }
  }, [fetchPage, currentPage]);

  const refresh = useCallback(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  return {
    imoveis,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage: currentPage > 1,
    goToPage,
    nextPage,
    previousPage,
    refresh,
  };
}

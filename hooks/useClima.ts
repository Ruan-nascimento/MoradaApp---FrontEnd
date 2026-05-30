import { useState, useEffect, useRef } from "react";
import { ClimaData } from "../utils/interfaces/imoveis";
import { mapearWeatherCode } from "../utils/formatters";


const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";


const climaCache = new Map<string, ClimaData>();


interface UseClimaReturn {
  clima: ClimaData | null;
  loading: boolean;
  error: string | null;
}


async function buscarCoordenadas(
  cidade: string,
  uf: string
): Promise<{ lat: number; lon: number }> {
  const query = `${cidade}, ${uf}, Brasil`;
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "MoradaApp/1.0" },
  });

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Cidade não encontrada");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}


async function buscarClima(lat: number, lon: number): Promise<ClimaData> {
  const params = [
    `latitude=${lat}`,
    `longitude=${lon}`,
    `current_weather=true`,
    `daily=temperature_2m_max,temperature_2m_min`,
    `timezone=America/Sao_Paulo`,
    `forecast_days=1`,
  ].join("&");

  const url = `${OPEN_METEO_URL}?${params}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.current_weather) {
    throw new Error("Dados de clima indisponíveis");
  }

  const weather = data.current_weather;
  const { descricao, icone } = mapearWeatherCode(weather.weathercode);

  return {
    temperatura: Math.round(weather.temperature),
    descricao,
    icone,
    maxima: Math.round(data.daily.temperature_2m_max[0]),
    minima: Math.round(data.daily.temperature_2m_min[0]),
  };
}


export function useClima(cidade: string, uf: string): UseClimaReturn {
  const [clima, setClima] = useState<ClimaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!cidade || !uf) return;

    const cacheKey = `${cidade}-${uf}`.toLowerCase();
    const cached = climaCache.get(cacheKey);

    if (cached) {
      setClima(cached);
      setLoading(false);
      return;
    }

    async function fetchClima() {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const coords = await buscarCoordenadas(cidade, uf);
        const climaData = await buscarClima(coords.lat, coords.lon);

        climaCache.set(cacheKey, climaData);
        setClima(climaData);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar clima");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }

    fetchClima();
  }, [cidade, uf]);

  return { clima, loading, error };
}

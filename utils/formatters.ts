import { Review } from "./interfaces/imoveis";


const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];


export function calcularMediaEstrelas(reviews: { stars: number }[]): number {
  if (reviews.length === 0) return 0;

  const soma = reviews.reduce((acc, r) => acc + r.stars, 0);
  return soma / reviews.length;
}


export function formatarMediaEstrelas(media: number): string {
  if (media === 0) return "0,0";
  return media.toFixed(1).replace(".", ",");
}


export function formatarPreco(price: number): string {
  return `R$ ${price.toLocaleString("pt-BR")}`;
}


export function formatarData(dateString: string): string {
  const date = new Date(dateString);
  const mes = MESES[date.getMonth()];
  const ano = date.getFullYear();

  return `${mes} de ${ano}`;
}


export function calcularTempoHost(createdAt: string): string {
  const criacao = new Date(createdAt);
  const agora = new Date();

  const diffMs = agora.getTime() - criacao.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 30) return "há poucos dias";
  if (diffDias < 365) {
    const meses = Math.floor(diffDias / 30);
    return `há ${meses} ${meses === 1 ? "mês" : "meses"}`;
  }

  const anos = Math.floor(diffDias / 365);
  return `há ${anos} ${anos === 1 ? "ano" : "anos"}`;
}


interface WeatherInfo {
  descricao: string;
  icone: string;
}

const WEATHER_MAP: Record<number, WeatherInfo> = {
  0: { descricao: "Céu Limpo", icone: "☀️" },
  1: { descricao: "Parcialmente Limpo", icone: "🌤️" },
  2: { descricao: "Parcialmente Nublado", icone: "⛅" },
  3: { descricao: "Nublado", icone: "☁️" },
  45: { descricao: "Nevoeiro", icone: "🌫️" },
  48: { descricao: "Nevoeiro Gelado", icone: "🌫️" },
  51: { descricao: "Garoa Leve", icone: "🌦️" },
  53: { descricao: "Garoa Moderada", icone: "🌦️" },
  55: { descricao: "Garoa Intensa", icone: "🌧️" },
  61: { descricao: "Chuva Leve", icone: "🌧️" },
  63: { descricao: "Chuva Moderada", icone: "🌧️" },
  65: { descricao: "Chuva Forte", icone: "🌧️" },
  71: { descricao: "Neve Leve", icone: "🌨️" },
  73: { descricao: "Neve Moderada", icone: "🌨️" },
  75: { descricao: "Neve Forte", icone: "❄️" },
  80: { descricao: "Pancadas Leves", icone: "🌦️" },
  81: { descricao: "Pancadas Moderadas", icone: "🌧️" },
  82: { descricao: "Pancadas Fortes", icone: "⛈️" },
  95: { descricao: "Tempestade", icone: "⛈️" },
  96: { descricao: "Tempestade com Granizo", icone: "⛈️" },
  99: { descricao: "Tempestade Severa", icone: "⛈️" },
};


export function mapearWeatherCode(code: number): WeatherInfo {
  return WEATHER_MAP[code] || { descricao: "Indefinido", icone: "🌡️" };
}


export function contarEstrelasPorNivel(reviews: { stars: number }[]): number[] {
  const contagem = [0, 0, 0, 0, 0];

  reviews.forEach((r) => {
    const idx = r.stars - 1;
    if (idx >= 0 && idx < 5) {
      contagem[idx]++;
    }
  });

  return contagem;
}

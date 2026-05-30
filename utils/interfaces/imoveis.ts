export interface Highlight {
  id: string;
  name: string;
  imoveisId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Host {
  id: string;
  name: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  imoveisId: string;
  createdAt: string;
  updatedAt: string;
  imgUser: string;
  name: string;
  stars: number;
  comment: string;
}

export interface ReviewResumo {
  stars: number;
}

export interface Imovel {
  id: string;
  photo: string;
  uf: string;
  city: string;
  title: string;
  hostId: string;
  host?: Host;
  highlights?: Highlight[];
  reviews?: ReviewResumo[];
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImovelDetalhado {
  id: string;
  photo: string;
  uf: string;
  city: string;
  title: string;
  hostId: string;
  host: Host;
  highlights: Highlight[];
  reviews: Review[];
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClimaData {
  temperatura: number;
  descricao: string;
  icone: string;
  maxima: number;
  minima: number;
}

export interface PaginatedImoveisResponse {
  data: Imovel[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface ImovelDetalhadoResponse {
  data: ImovelDetalhado;
  success: boolean;
  message?: string;
}

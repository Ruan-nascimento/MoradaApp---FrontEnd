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

export interface Imovel {
  id: string;
  photo: string;
  uf: string;
  city: string;
  title: string;
  hostId: string;
  host?: Host;
  highlights?: Highlight[];
  reviews?: Review[];
  price: number;
  createdAt: string;
  updatedAt: string;
}

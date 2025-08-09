export type Unit = {
  id: string;
  tipologia: string;
  m2: number;
  price: number;
  estacionamiento: boolean;
  bodega: boolean;
  disponible: boolean;
};

export type Building = {
  id: string;
  name: string;
  comuna: string;
  address: string;
  cover: string;
  hero?: string;
  promo?: { label: string; tag?: string };
  amenities: string[];
  units: Unit[];
  gallery: string[];
};

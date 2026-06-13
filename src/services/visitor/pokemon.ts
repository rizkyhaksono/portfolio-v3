const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PokemonCard {
  id: number;
  name: string;
  image: string | null;
  types: string[];
  height: number;
  weight: number;
}

export interface PokemonDetail extends PokemonCard {
  sprites: { front: string; shiny: string; artwork: string };
  abilities: { name: string; isHidden: boolean }[];
  stats: Record<string, number>;
  baseExperience: number;
}

export interface PokemonListResponse {
  data: PokemonCard[];
  page: number;
  total: number;
  totalPages: number;
  prev: number | null;
  next: number | null;
}

export async function getPokemonList(page = 1, limit = 24): Promise<PokemonListResponse> {
  const res = await fetch(`${API_URL}/v3/tools/pokemon?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon");
  return res.json();
}

export async function getPokemonDetail(idOrName: string | number): Promise<PokemonDetail | null> {
  const res = await fetch(`${API_URL}/v3/tools/pokemon/${String(idOrName).toLowerCase().trim()}`);
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data) return null;
  return json.data;
}

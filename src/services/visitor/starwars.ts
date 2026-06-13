const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SWPerson {
  id: number;
  name: string;
  image: string | null;
  gender: string;
  species: string;
  homeworld: string;
  height: string;
  mass: string;
  birthYear: string;
  eyeColor: string;
  hairColor: string;
  affiliations: string[];
}

export interface SWStarship {
  id: number;
  name: string;
  image: string | null;
  model: string;
  manufacturer: string;
  starshipClass: string;
  crew: string;
  passengers: string;
  hyperdriveRating: string;
  mglt: string;
}

interface Paginated<T> {
  data: T[];
  page: number;
  total: number;
  totalPages: number;
  prev: number | null;
  next: number | null;
}

export async function getSWPeople(page = 1): Promise<Paginated<SWPerson>> {
  const res = await fetch(`${API_URL}/v3/tools/starwars/people?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch Star Wars characters");
  return res.json();
}

export async function getSWStarships(page = 1): Promise<Paginated<SWStarship>> {
  const res = await fetch(`${API_URL}/v3/tools/starwars/starships?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch Star Wars starships");
  return res.json();
}

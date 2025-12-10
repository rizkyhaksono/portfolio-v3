import type {
  ProvinceResponse,
  CityResponse,
  DistrictResponse,
  VillageResponse,
  PostalCodeSearchResponse,
} from "@/commons/types/tools";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProvinces(): Promise<ProvinceResponse> {
  const response = await fetch(`${API_URL}/v3/tools/provinces`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch provinces");
  return await response.json();
}

export async function getCities(provinceCode: string): Promise<CityResponse> {
  const response = await fetch(`${API_URL}/v3/tools/cities/${provinceCode}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch cities");
  return await response.json();
}

export async function getDistricts(cityCode: string): Promise<DistrictResponse> {
  const response = await fetch(`${API_URL}/v3/tools/districts/${cityCode}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch districts");
  return await response.json();
}

export async function getVillages(districtCode: string): Promise<VillageResponse> {
  const response = await fetch(`${API_URL}/v3/tools/villages/${districtCode}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch villages");
  return await response.json();
}

export async function searchPostalCode(villageCode: string): Promise<PostalCodeSearchResponse> {
  const response = await fetch(`${API_URL}/v3/tools/cari-kode-pos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kode_pos: villageCode }),
  });
  if (!response.ok) throw new Error("Failed to search postal code");
  return await response.json();
}

import { useQuery } from "@tanstack/react-query";
import type { FilterValues } from "../components/filters/FilterBar";
import type { TypologySummary, PromotionBadge } from "../schemas/models";

export type PriceRange = { min: number; max: number };

export type BuildingSummary = {
  id: string;
  slug: string;
  name: string;
  comuna: string;
  address: string;
  gallery: string[];
  coverImage?: string;
  badges?: PromotionBadge[];
  serviceLevel?: "pro" | "standard";
  precioDesde: number; // computed, always present in list
  precioRango?: PriceRange;
  hasAvailability: boolean;
  typologySummary?: TypologySummary[]; // compact summary for list
};

interface BuildingsResponse { buildings: BuildingSummary[] }

interface FetchBuildingsParams {
  filters: FilterValues;
  sort?: string;
}

const createQueryKey = (filters: FilterValues, sort?: string) => {
  const key = ["buildings"];
  
  // Only add non-default filter values to the key
  if (filters.comuna && filters.comuna !== "Todas") {
    key.push("comuna", filters.comuna);
  }
  if (filters.tipologia && filters.tipologia !== "Todas") {
    key.push("tipologia", filters.tipologia);
  }
  if (filters.minPrice) {
    key.push("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice) {
    key.push("maxPrice", filters.maxPrice.toString());
  }
  if (sort && sort !== "default") {
    key.push("sort", sort);
  }
  
  return key;
};

const fetchBuildings = async ({ filters, sort }: FetchBuildingsParams): Promise<BuildingSummary[]> => {
  const params = new URLSearchParams();
  
  // Only add non-default filter values to the URL
  if (filters.comuna && filters.comuna !== "Todas") {
    params.append("comuna", filters.comuna);
  }
  if (filters.tipologia && filters.tipologia !== "Todas") {
    params.append("tipologia", filters.tipologia);
  }
  if (filters.minPrice) {
    params.append("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice) {
    params.append("maxPrice", filters.maxPrice.toString());
  }
  if (sort && sort !== "default") {
    params.append("sort", sort);
  }
  
  const url = `/api/buildings${params.toString() ? `?${params.toString()}` : ""}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  const data: BuildingsResponse = await response.json();
  return data.buildings;
};

export function useFetchBuildings({ filters, sort }: FetchBuildingsParams) {
  return useQuery({
    queryKey: createQueryKey(filters, sort),
    queryFn: () => fetchBuildings({ filters, sort }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount: number, error: Error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes("Error 4")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export type { FilterValues };

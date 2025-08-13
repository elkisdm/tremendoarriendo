/**
 * Advanced Search Algorithm for Buildings
 * Implements fuzzy search with scoring and ranking
 */

import type { Building } from '../schemas/models';

export interface SearchOptions {
  /** Search query string */
  query: string;
  /** Weight for name matching (0-1) */
  nameWeight?: number;
  /** Weight for address matching (0-1) */
  addressWeight?: number;
  /** Weight for amenities matching (0-1) */
  amenitiesWeight?: number;
  /** Minimum score threshold (0-1) */
  threshold?: number;
  /** Maximum results to return */
  maxResults?: number;
}

export interface SearchResult {
  building: Building;
  score: number;
  matches: {
    name?: boolean;
    address?: boolean;
    amenities?: string[];
  };
}

const DEFAULT_OPTIONS: Required<Omit<SearchOptions, 'query'>> = {
  nameWeight: 0.4,
  addressWeight: 0.3,
  amenitiesWeight: 0.3, // Increased amenities weight
  threshold: 0.15, // Lower threshold for amenity searches
  maxResults: 100,
};

/**
 * Normalize string for search (lowercase, remove accents, trim)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

/**
 * Calculate fuzzy similarity between two strings using simple algorithm
 * Returns score between 0 and 1
 */
function calculateSimilarity(query: string, target: string): number {
  const normalizedQuery = normalizeString(query);
  const normalizedTarget = normalizeString(target);
  
  if (normalizedQuery === normalizedTarget) return 1.0;
  
  // Exact substring match gets high score
  if (normalizedTarget.includes(normalizedQuery)) return 0.9;
  
  // Check if query words are in target (for multi-word queries)
  const queryWords = normalizedQuery.split(' ').filter(w => w.length > 1); // Ignore only single characters
  const targetWords = normalizedTarget.split(' ').filter(w => w.length > 0);
  
  if (queryWords.length > 0) {
    const exactMatches = queryWords.filter(qWord => 
      targetWords.some(tWord => tWord === qWord)
    );
    
    const partialMatches = queryWords.filter(qWord => 
      targetWords.some(tWord => tWord.includes(qWord) || qWord.includes(tWord))
    );
    
    if (exactMatches.length > 0) {
      const exactRatio = exactMatches.length / queryWords.length;
      return exactRatio * 0.8; // High score for exact word matches
    }
    
    if (partialMatches.length > 0) {
      const partialRatio = partialMatches.length / queryWords.length;
      return partialRatio * 0.6; // Medium score for partial word matches
    }
  }
  
  // Single word or no word matches - check character similarity
  const queryChars = new Set(normalizedQuery.split(''));
  const targetChars = new Set(normalizedTarget.split(''));
  const intersection = new Set([...queryChars].filter(x => targetChars.has(x)));
  
  const charSimilarity = intersection.size / Math.max(queryChars.size, targetChars.size);
  
  // Only return character similarity for high matches or exact character sequences
  if (charSimilarity > 0.7) {
    return charSimilarity * 0.4;
  }
  
  return 0;
}

/**
 * Search amenities and return matching ones
 */
function searchAmenities(query: string, amenities: string[]): string[] {
  const normalizedQuery = normalizeString(query);
  
  return amenities.filter(amenity => {
    const normalizedAmenity = normalizeString(amenity);
    // More permissive amenity matching
    return normalizedAmenity.includes(normalizedQuery) || 
           normalizedAmenity === normalizedQuery ||
           calculateSimilarity(query, amenity) > 0.3; // Lower threshold for amenity matching
  });
}

/**
 * Search buildings with fuzzy matching and scoring
 */
export function searchBuildings(
  buildings: Building[],
  options: SearchOptions
): SearchResult[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { query, nameWeight, addressWeight, amenitiesWeight, threshold, maxResults } = opts;
  
  if (!query.trim()) {
    return buildings.map(building => ({
      building,
      score: 1.0,
      matches: {}
    })).slice(0, maxResults);
  }
  
  const results: SearchResult[] = [];
  
  for (const building of buildings) {
    let totalScore = 0;
    const matches: SearchResult['matches'] = {};
    
    // Search in name
    const nameScore = calculateSimilarity(query, building.name);
    if (nameScore > 0) {
      totalScore += nameScore * nameWeight;
      matches.name = nameScore > 0.5;
    }
    
    // Search in address
    const addressScore = calculateSimilarity(query, building.address);
    if (addressScore > 0) {
      totalScore += addressScore * addressWeight;
      matches.address = addressScore > 0.5;
    }
    
    // Search in amenities
    const matchingAmenities = searchAmenities(query, building.amenities);
    if (matchingAmenities.length > 0) {
      // Give high score for amenity matches since they are exact
      const amenitiesScore = Math.min(1.0, matchingAmenities.length * 2 / building.amenities.length);
      totalScore += amenitiesScore * amenitiesWeight;
      matches.amenities = matchingAmenities;
    }
    
    // Only include results above threshold
    if (totalScore >= threshold) {
      results.push({
        building,
        score: totalScore,
        matches
      });
    }
  }
  
  // Sort by score (descending) and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Extract search suggestions from buildings data
 */
export function getSearchSuggestions(buildings: Building[]): string[] {
  const suggestions = new Set<string>();
  
  for (const building of buildings) {
    // Add building names
    suggestions.add(building.name);
    
    // Add comuna names
    suggestions.add(building.comuna);
    
    // Add amenities
    building.amenities.forEach((amenity: string) => suggestions.add(amenity));
  }
  
  return Array.from(suggestions).sort();
}

/**
 * Highlight matching text in search results
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const normalizedQuery = normalizeString(query);
  const normalizedText = normalizeString(text);
  
  if (!normalizedText.includes(normalizedQuery)) return text;
  
  // Simple highlighting (can be enhanced with proper regex)
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Debounced search function for real-time search
 */
export function createDebouncedSearch<T extends unknown[]>(
  searchFn: (...args: T) => SearchResult[],
  delay: number = 300
): (...args: T) => Promise<SearchResult[]> {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: T): Promise<SearchResult[]> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(searchFn(...args));
      }, delay);
    });
  };
}

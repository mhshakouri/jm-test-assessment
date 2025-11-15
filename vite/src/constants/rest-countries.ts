/**
 * REST Countries API configuration
 * Using v2 version: https://jm-test-assessment.vercel.app/
 */

import { Region } from "../types";

const API_VERSION = "v2";
const BASE_URL = `https://restcountries.com/${API_VERSION}`;

// API route names (used for type generation)
export const restCountriesApiRoutes = [
  "alpha", 
  "all", 
  "name", 
  "region"
] as const;

// Field definitions
const FIELD_SETS = {
  minimal: [
    "name",
    "nativeName",
    "population",
    "region",
    "flags",
    "capital",
    "alpha3Code",
  ],
  full: [
    "name",
    "nativeName",
    "population",
    "region",
    "subregion",
    "capital",
    "flags",
    "topLevelDomain",
    "currencies",
    "languages",
    "borders",
    "alpha3Code",
  ],
} as const;

/**
 * Build URL for fetching countries list (all or by region)
 */
export const getCountriesUrl = (region?: Lowercase<Region>): string => {
  const fields = FIELD_SETS.minimal.join(",");
  const path = region ? `/region/${region.toLowerCase()}` : "/all";
  return `${BASE_URL}${path}?fields=${fields}`;
};

/**
 * Build URL for fetching a single country by code
 */
export const getCountryUrl = (code: string): string => {
  const fields = FIELD_SETS.full.join(",");
  return `${BASE_URL}/alpha/${code.toLowerCase()}?fields=${fields}`;
};

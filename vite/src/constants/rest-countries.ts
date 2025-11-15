// using v2 version of the api https://jm-test-assessment.vercel.app/

import {
  RestCountriesApiRoute,
  RestCountriesApiRouteKind,
  Region,
} from "../types";
import { regionsData } from "./regions";

const targetVersion = "v2";

// used routes from the api
const restCountriesApiRoutes = [
  "alpha", 
  "all", 
  "name", 
  "region"
] as const;

const fields: Record<(typeof restCountriesApiRoutes)[number], string[]> = {
  all: [
    "name",
    "nativeName",
    "population",
    "region",
    "flags",
    "capital",
    "alpha3Code",
  ],
  name: [
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
  alpha: ["name"],
  region: [
    "name",
    "nativeName",
    "population",
    "region",
    "flags",
    "capital",
    "alpha3Code",
  ],
};

const regionsRoutes = regionsData.map((region: Region) => ({
  kind: "region",
  name: region,
  path: `/region/${region.toLowerCase()}`,
  fields: fields.region,
}));

const routes = [
  ...restCountriesApiRoutes.map((route) => {
    if (route !== "region") {
      return {
        kind: route as RestCountriesApiRouteKind,
        name: route,
        path: `/${route.toLowerCase()}`,
        fields: fields[route],
      };
    }
  }),
  ...regionsRoutes,
].filter(Boolean) as RestCountriesApiRoute[];

const restCountriesApi = {
  baseUrl: `https://restcountries.com/${targetVersion}`,
  routes,
};

export { restCountriesApiRoutes, restCountriesApi };

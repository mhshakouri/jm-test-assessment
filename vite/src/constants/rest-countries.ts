// using v2 version of the api https://jm-test-assessment.vercel.app/

import {
  RestCountriesApiRoute,
  RestCountriesApiRouteKind,
  Region,
} from "../types";
import { regionsData } from "./regions";

const targetVersion = "v2";

// used routes from the api
const restCountriesApiRoutes = ["alpha", "all", "name", "region"] as const;

const fields: Record<(typeof restCountriesApiRoutes)[number], string[]> = {
  all: ["name", "capital", "population", "region", "flags"],
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
  ],
  alpha: ["name"],
  region: ["name", "capital", "population", "region", "flags"],
};

const regionsRoutes = regionsData.map((region: Region) => ({
  kind: "region",
  name: region.toLowerCase(),
  path: `/region/${region.toLowerCase()}`,
  fields: fields.region,
}));

const routes = [
  ...restCountriesApiRoutes.map((route) => {
    if (route !== "region") {
      return {
        kind: route.toLowerCase() as RestCountriesApiRouteKind,
        name: route.toLowerCase(),
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

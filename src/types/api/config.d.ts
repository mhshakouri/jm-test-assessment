import { restCountriesApiRoutes } from "../../constants/rest-countries";

type RestCountriesApiRouteKind = (typeof restCountriesApiRoutes)[number];

interface RestCountriesApiRoute {
    kind: RestCountriesApiRouteKind;
    name: string;
    path: string;
    fields: string[];
}

export type { RestCountriesApiRoute, RestCountriesApiRouteKind };
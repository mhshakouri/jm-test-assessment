import type { Country, Region } from "..";
interface CountryRepositoryItem extends Omit<Country, "region"> {
    region: Lowercase<Region>
}
type CountriesRepository = Map<string, CountryRepositoryItem>;
export type { CountriesRepository }
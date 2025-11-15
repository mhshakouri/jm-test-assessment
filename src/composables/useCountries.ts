import { computed, ref } from "vue";
import { Country, Region } from "../types";
import { createSharedComposable } from "@vueuse/core";
import { useRegionFilter } from "./useRegionFilter";
import { useSearch } from "./useSearch";
import { CountriesRepository } from "../types/composables/countries";
import { useSort } from "./useSort";
import { fuzzyMatch } from "../utils/fuzzyMatch";

const useCountriesComposable = () => {
  const { searchText, searchAll, isSearching } = useSearch();
  const { regionFilter } = useRegionFilter();
  const { sort, sortOrder } = useSort("name", "asc");

  const countriesRepository = ref<CountriesRepository>(new Map());

  const region = computed(() =>
    regionFilter.value?.length
      ? (regionFilter.value?.toString?.().toLowerCase() as Lowercase<Region>)
      : undefined
  );
  const countriesArray = computed<Country[]>(() =>
    sortedCountries(Array.from(countriesRepository.value.values()))
  );
  const countries = computed<Country[]>(() =>
    region.value && !searchAll.value
      ? countriesArray.value.filter(
          (country) =>
            country.region.toLowerCase() === region.value?.toLowerCase()
        )
      : countriesArray.value
  );
  const countriesBySearch = computed<Country[]>(() =>
    filteredCountries(countries.value)
  );
  const countriesList = computed<Country[]>(() => {
    if (!isSearching.value) {
      return countries.value;
    }
    return countriesBySearch.value;
  });

  const normalizePopulation = (value: unknown): number | "N/A" => {
    if (value === "N/A" || value === undefined || value === null) return "N/A";
    const num = Number(value);
    return !isNaN(num) ? num : "N/A";
  };

  const setCountry = (
    data: Partial<Country>,
    options?: { needFullDetails?: boolean }
  ) => {
    if (!data.alpha3Code) return;

    const currentCountry = countriesRepository.value.get(data.alpha3Code);
    const population = normalizePopulation(
      data.population ?? currentCountry?.population
    );
    const needFullDetails =
      options?.needFullDetails !== undefined
        ? options.needFullDetails
        : !data.borders?.length && !data.currencies?.length;

    const country: Country = {
      ...currentCountry,
      ...data,
      alpha3Code: data.alpha3Code,
      population,
      capital: data.capital ?? currentCountry?.capital ?? "N/A",
      needFullDetails,
    } as Country;

    countriesRepository.value.set(data.alpha3Code, country);

    // Replace Map reference to ensure Vue reactivity
    countriesRepository.value = new Map(countriesRepository.value);
  };

  const setCountries = (data: Partial<Country>[]) => {
    (data ?? []).forEach((country) => setCountry(country));
  };

  const sortedCountries = (data: Country[]): Country[] => {
    return [...data].sort((a, b) => {
      let comparison = 0;

      if (sort.value === "name") {
        comparison = a.name.localeCompare(b.name);
      } else {
        // Sort by population
        if (a.population === "N/A" && b.population === "N/A") {
          comparison = 0;
        } else if (a.population === "N/A") {
          comparison = 1; // N/A goes to end
        } else if (b.population === "N/A") {
          comparison = -1; // N/A goes to end
        } else {
          comparison = (a.population as number) - (b.population as number);
        }
      }

      return comparison * (sortOrder.value === "asc" ? 1 : -1);
    });
  };

  const filteredCountries = (data: Country[]) => {
    const searchTextString = searchText.value?.trim?.()?.toLowerCase?.();
    if (!searchTextString?.length) {
      return data;
    }
    return data.filter((country) => {
      // Check country name (e.g., "Germany")
      return fuzzyMatch(searchTextString, country.name);
    });
  };

  const getCountryByCode = (code?: string): Country | undefined => {
    const codeString = code?.trim?.()?.toLowerCase();
    if (!codeString?.length) return undefined;

    // Try direct Map lookup first (case-insensitive search)
    for (const [key, country] of countriesRepository.value.entries()) {
      if (
        key.toLowerCase() === codeString ||
        country.alpha3Code?.toLowerCase() === codeString
      ) {
        return country;
      }
    }

    return undefined;
  };

  return {
    setCountries,
    setCountry,
    countriesList,
    countriesRepository,
    countriesArray,
    getCountryByCode,
  };
};

export const useCountries = createSharedComposable(useCountriesComposable);

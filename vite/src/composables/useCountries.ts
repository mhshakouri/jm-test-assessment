import { computed, ref } from "vue";
import { Country, Region, SortOptions, SortOrders } from "../types";
import { createSharedComposable } from "@vueuse/core";
import { useRegionFilter } from "./useRegionFilter";
import { useSearch } from "./useSearch";
import { CountriesRepository } from "../types/composables/countries";
import { useSort } from "./useSort";

const useCountriesComposable = () => {
  const { searchText, searchAll, isSearching } = useSearch();
  const { regionFilter } = useRegionFilter();
  const defaultSort = ref<SortOptions>("name");
  const defaultSortOrder = ref<SortOrders>("asc");
  const { sort, sortOrder } = useSort(
    defaultSort.value,
    defaultSortOrder.value
  );
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

  const setCountry = (data: Partial<Country>) => {
    if (!data.alpha3Code) return;

    const currentCountry = countriesRepository.value.get(data.alpha3Code);
    if (!currentCountry) {
      let population = data.population ?? "N/A";
      population = !isNaN(Number(population)) ? Number(population) : "N/A";
      countriesRepository.value.set(data.alpha3Code, {
        ...(data as Country),
        population: population,
        capital: data.capital ?? "N/A",
      });
    } else {
      let population = data.population ?? currentCountry.population;
      population = !isNaN(Number(population)) ? Number(population) : "N/A";
      countriesRepository.value.set(data.alpha3Code, {
        alpha3Code: data.alpha3Code ?? currentCountry.alpha3Code,
        region: data.region ?? currentCountry.region,
        name: data.name ?? currentCountry.name,
        nativeName: data.nativeName ?? currentCountry.nativeName,
        population: population,
        subregion: data.subregion ?? currentCountry.subregion,
        capital: data.capital ?? currentCountry.capital ?? "N/A",
        flags: data.flags ?? currentCountry.flags,
        topLevelDomain: data.topLevelDomain ?? currentCountry.topLevelDomain,
        currencies: data.currencies ?? currentCountry.currencies,
        languages: data.languages ?? currentCountry.languages,
        borders: data.borders ?? currentCountry.borders,
      });
    }
    
    // Ensure reactivity by replacing the Map reference
    // This ensures Vue detects the change, especially for Map mutations
    const newMap = new Map(countriesRepository.value);
    countriesRepository.value = newMap;
  };
  const setCountries = (data: Partial<Country>[]) => {
    (data ?? []).forEach((country) => setCountry(country));
  };
  const sortedCountries = (data: Country[]) => {
    return data.sort(
      (a, b) =>
        (sort.value === defaultSort.value
          ? a.name.localeCompare(b.name)
          : a.population === "N/A"
          ? 0
          : b.population === "N/A"
          ? 0
          : a.population - b.population) *
        (sortOrder.value === defaultSortOrder.value ? 1 : -1)
    );
  };
  /**
   * NOTE: I generated this function using AI, it's not perfect but it's a good start.
   * I used this prompt, to be honest:
   * "I want to change the filteredCountries function so that it would also have search results for something like:
   * text search: grmany or grmny
   * result => germany
   * I think implementing something that gets the order of the character,
   * matches if the order can happen within a country name would be logical"
   * 
   * Fuzzy matching function that checks if characters in the query
   * appear in order within the text (case-insensitive).
   * 
   * Examples:
   * - "grmany" matches "Germany" (g-r-m-a-n-y appear in order)
   * - "grmny" matches "Germany" (g-r-m-n-y appear in order)
   * - "usa" matches "United States of America" (u-s-a appear in order)
   */
  const fuzzyMatch = (query: string, text: string): boolean => {
    if (!query || !text) return false;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // If query is empty, match everything
    if (queryLower.length === 0) return true;
    
    // Check if query is a substring (exact match)
    if (textLower.includes(queryLower)) return true;
    
    // Fuzzy match: check if all characters appear in order
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    
    // Match if we found all characters in order
    return queryIndex === queryLower.length;
  };

  const filteredCountries = (data: Country[]) => {
    if (!searchText.value || !searchText.value.trim()) {
      return data;
    }
    
    const query = searchText.value.trim();
    
    return data.filter((country) => {
      // Check country name (e.g., "Germany")
      if (fuzzyMatch(query, country.name)) {
        return true;
      }
      
      // Also check native name if available
      if (country.nativeName && fuzzyMatch(query, country.nativeName)) {
        return true;
      }
      
      return false;
    });
  };

  const getCountryByName = (name: string): Country | undefined => {
    if (!name) return undefined;
    const nameLower = name.toLowerCase().trim();
    return countriesArray.value.find(country => country.name?.toLowerCase().trim() === nameLower);
  };

  return {
    setCountries,
    setCountry,
    countriesList,
    countriesRepository,
    countriesArray,
    getCountryByName
  };
};

export const useCountries = createSharedComposable(useCountriesComposable);

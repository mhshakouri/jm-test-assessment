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
    countries.value.filter((country) =>
      country.name.toLowerCase().includes(searchText.value?.toLowerCase() ?? "")
    )
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

  return {
    setCountries,
    setCountry,
    countriesList,
    countriesRepository,
    countriesArray,
  };
};

export const useCountries = createSharedComposable(useCountriesComposable);

import { computed, ref, watch } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { restCountriesApi } from "../constants/rest-countries";
import { useRegionFilter } from "./useRegionFilter";
import { Country, Region } from "../types";
import { useFetchAsyncData } from "./useFetchAsyncData";
import { useCountries } from "./useCountries";

const useFetchCountriesComposable = () => {
  const { regionFilter } = useRegionFilter();
  const { setCountries, countriesList: fetchCountriesList, setCountry } = useCountries();

  const fetchCountryName = ref<string>()
  const fetchCountryKey = computed(() => `country-${fetchCountryName.value}`);
  const fetchCountryApiRoute = computed(() => restCountriesApi.routes.find(route => route.kind === "name" && route.name === "name"));
  const fetchCountryUrl = computed(() => `${restCountriesApi.baseUrl}/name/${fetchCountryName.value}?fields=${fetchCountryApiRoute.value?.fields.join(",")}`);

  const region = computed(() =>
    regionFilter.value?.length
      ? (regionFilter.value?.toString?.() as Lowercase<Region>)
      : undefined
  );

  const fetchKey = computed(() =>
    region.value ? `countries-${region.value}` : "countries-all"
  );

  const apiRoute = computed(() =>
    restCountriesApi.routes.find(
      (route) =>
        route.kind === (region.value ? "region" : "all") &&
        route.name === (region.value ? region.value : "all")
    )
  );

  const url = computed(
    () =>
      `${restCountriesApi.baseUrl}${
        apiRoute.value?.path
      }?fields=${apiRoute.value?.fields.join(",")}`
  );

  const fetchCountriesFromApi = async () => {
    return await fetch(url.value)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(async(data: Country[]) => {
        return data;
      })
      .catch((error) => {
        throw error;
      })
  };

  const fetchCountryFromApi = async (): Promise<Country> => {
    const response = await fetch(fetchCountryUrl.value);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Country[] = await response.json();
    // The API returns an array, take the first result
    if (!data || data.length === 0) {
      throw new Error('No country found');
    }
    return data[0];
  };

  const { data, execute: getCountries, pending, error } = useFetchAsyncData<Country[]>(
    () => fetchKey.value,
    async () => await fetchCountriesFromApi(),
    {
      immediate: false,
      server: true,
    }
  );

  const { data: countryData, execute: getCountry, pending: countryPending, error: countryError } = useFetchAsyncData<Country>(
    () => fetchCountryKey.value,
    async () => await fetchCountryFromApi(),
    {
      immediate: false,
      server: true,
    }
  );

  // Watch for hydrated data and set it in the repository (client-side only)
  // On SSR, we'll set it directly in fetchCountries after execute()
  if (!import.meta.env.SSR) {
    watch(data, (newData) => {
      if (newData && newData.length > 0) {
        setCountries(newData);
      }
    }, { immediate: true });
  }

  const fetchCountries = async () => {
    try {
      await getCountries();
      if (error.value) {  
        throw error.value;
      }
      // On SSR, ensure data is set synchronously before component renders
      if (data.value && data.value.length > 0) {
        setCountries(data.value);
      }
    } catch (err) {
      console.error(err);
      // Error is already set in error.value
    }
  };

  const fetchCountry = async (name: string) => {
    fetchCountryName.value = name;
    try {
      await getCountry();
      if (countryError.value) {
        throw countryError.value;
      }
      // Set the country in the repository
      if (countryData.value) {
        setCountry(countryData.value);
      }
    } catch (err) {
      console.error(err);
      // Error is already set in countryError.value
    }
  };

  return { fetchCountries, data, pending, error, countriesList: fetchCountriesList, fetchCountry, countryPending, countryError, countryData };
};

export const useFetchCountries = createSharedComposable(useFetchCountriesComposable);

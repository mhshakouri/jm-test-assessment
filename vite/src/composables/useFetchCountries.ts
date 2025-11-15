import { computed, watch } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { restCountriesApi } from "../constants/rest-countries";
import { useRegionFilter } from "./useRegionFilter";
import { Country, Region } from "../types";
import { useFetchAsyncData } from "./useFetchAsyncData";
import { useCountries } from "./useCountries";

const useFetchCountriesComposable = () => {
  const { regionFilter } = useRegionFilter();
  const { setCountries, countriesList: fetchCountriesList } = useCountries();

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

  const { data, execute, pending, error } = useFetchAsyncData<Country[]>(
    () => fetchKey.value,
    async () => await fetchCountriesFromApi(),
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
      await execute();
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

  return { fetchCountries, data, pending, error, countriesList: fetchCountriesList };
};

export const useFetchCountries = createSharedComposable(useFetchCountriesComposable);

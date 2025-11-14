import { computed, ref } from "vue";
import { Country } from "../types";
import { restCountriesApi } from "../constants/rest-countries";
import { createSharedComposable, watchDebounced } from "@vueuse/core";
import { useRegionFilter } from "./useRegionFilter";
import { useSearch } from "./useSearch";

const useCountriesComposable = () => {
  const { searchText } = useSearch();
  const { regionFilter } = useRegionFilter();

  const countries = ref<Country[]>([]);
  const isLoading = ref(false);
  const hasError = ref();
  const isSearching = ref(Boolean(searchText.value?.length));

  watchDebounced(
    searchText,
    (newSearchText?: string) => {
      isSearching.value = Boolean(newSearchText?.length);
    },
    { debounce: 250, maxWait: 500 }
  );

  const apiRoute = computed(() =>
    regionFilter.value
      ? restCountriesApi.routes.find(
          (route) =>
            route.kind === "region" && route.name === regionFilter.value
        )
      : restCountriesApi.routes.find(
          (route) => route.kind === "all" && route.name === "all"
        )
  );

  const url = computed(
    () =>
      `${restCountriesApi.baseUrl}${
        apiRoute.value?.path
      }?fields=${apiRoute.value?.fields.join(",")}`
  );

  const countriesList = computed(() => {
    if (isSearching.value) {
      return countries.value?.filter((country: Country) =>
        country.name
          .toLowerCase()
          .includes(searchText.value?.toLowerCase() ?? "")
      );
    }
    return countries.value;
  });

  const fetchCountries = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    hasError.value = undefined;
    await fetch(url.value)
      .then((response) => response.json())
      .then((data) => {
        countries.value = data;
      })
      .catch((error) => {
        countries.value = [];
        hasError.value = error;
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  return { countries, countriesList, fetchCountries, isLoading, hasError };
};

export const useCountries = createSharedComposable(useCountriesComposable);

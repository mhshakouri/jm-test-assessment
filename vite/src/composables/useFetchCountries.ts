import { computed, ref, watch } from "vue";
import { getCountriesUrl, getCountryUrl, getBorderCountryUrl } from "../constants/rest-countries";
import { useRegionFilter } from "./useRegionFilter";
import { Country, Region } from "../types";
import { useFetchAsyncData } from "./useFetchAsyncData";
import { useCountries } from "./useCountries";

// Pure API functions
const fetchCountriesFromApi = async (url: string): Promise<Country[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchCountryFromApi = async (url: string): Promise<Country> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: Country = await response.json();
  if (!data.name || !data.alpha3Code) {
    throw new Error('No country found');
  }
  return data;
};

export const useFetchCountries = () => {
  const { regionFilter } = useRegionFilter();
  const { setCountries, countriesList: fetchCountriesList, setCountry, getCountryByCode } = useCountries();

  // State
  const fetchCountryCode = ref<string>()

  // Computed values
  const region = computed(() =>
    regionFilter.value?.length
      ? (regionFilter.value?.toString?.() as Lowercase<Region>)
      : undefined
  );

  const fetchKey = computed(() =>
    region.value ? `countries-${region.value}` : "countries-all"
  );

  const fetchCountryKey = computed(() => 
    fetchCountryCode.value ? `country-${fetchCountryCode.value.toLowerCase()}` : undefined
  );

  const countriesUrl = computed(() => getCountriesUrl(region.value));
  const countryUrl = computed(() => 
    fetchCountryCode.value ? getCountryUrl(fetchCountryCode.value) : ''
  );


  // Setup async data fetching
  const { data: countriesData, execute: getCountries, pending: countriesPending, error: countriesError } = useFetchAsyncData<Country[]>(
    () => fetchKey.value,
    () => fetchCountriesFromApi(countriesUrl.value),
    {
      immediate: false,
      server: true,
    }
  );

  const { data: countryData, execute: getCountry, pending: countryPending, error: countryError } = useFetchAsyncData<Country>(
    () => fetchCountryKey.value ?? '',
    () => fetchCountryFromApi(countryUrl.value),
    {
      immediate: false,
      server: true,
    }
  );

  // Sync data to repository
  watch(countriesData, (newCountriesData) => {
    if (newCountriesData?.length > 0) {
      setCountries(newCountriesData);
    }
  }, { immediate: true, deep: true, flush: 'sync' });
  
  watch(countryData, (newCountryData) => {
    if (newCountryData?.alpha3Code) {
      setCountry(newCountryData);
    }
  }, { immediate: true, deep: true, flush: 'sync' });

  // Public functions
  const fetchCountries = async () => {
    try {
      await getCountries();
      if (countriesError.value) {  
        throw countriesError.value;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCountryByCode = async (code: string): Promise<Country | undefined> => {
    if (!code) return undefined;
    
    const normalizedCode = code.toLowerCase().trim();
    
    // Check repository first
    const existingCountry = getCountryByCode(normalizedCode);
    
    // Check if country has all required fields for detail page
    // If missing fields like currencies, languages, topLevelDomain, subregion, or borders,
    // we need to fetch full details even if needFullDetails is false
    const hasFullDetails = existingCountry && 
      Array.isArray(existingCountry.currencies) &&
      Array.isArray(existingCountry.languages) &&
      Array.isArray(existingCountry.topLevelDomain) &&
      typeof existingCountry.subregion === 'string' &&
      Array.isArray(existingCountry.borders);
    
    if (existingCountry && hasFullDetails) {
      return existingCountry;
    }
    
    try {
      fetchCountryCode.value = normalizedCode;
      await getCountry();
      if (countryError.value) {
        throw countryError.value;
      }
      
      // Get the fetched country from repository
      const fetchedCountry = getCountryByCode(normalizedCode);
      
      // Fetch border countries if they exist and aren't already fully loaded
      if (fetchedCountry?.borders?.length) {
        const borderPromises = fetchedCountry.borders
          .map(async (borderCode) => {
            const normalizedBorderCode = borderCode.toLowerCase().trim();
            const existingBorderCountry = getCountryByCode(normalizedBorderCode);
            
            // Only fetch if not already in repository or needs full details
            if (!existingBorderCountry || existingBorderCountry.needFullDetails) {
              try {
                const url = getBorderCountryUrl(normalizedBorderCode);
                const borderCountry = await fetchCountryFromApi(url);
                // Set border country with minimal data and mark as complete
                // (we don't need borders of borders, so explicitly set needFullDetails to false)
                setCountry(borderCountry, { needFullDetails: false });
              } catch (err) {
                console.error(`Failed to fetch border country ${normalizedBorderCode}:`, err);
              }
            }
          });
        
        // Fetch all border countries in parallel
        await Promise.all(borderPromises);
      }
      
      // Return from repository (set by watcher)
      return getCountryByCode(normalizedCode);
    } catch (err) {
      console.error(err);
      return undefined;
    } finally {
      fetchCountryCode.value = undefined;
    }
  };

  return { 
    fetchCountries, 
    countriesData, 
    countriesPending, 
    countriesError, 
    countriesList: fetchCountriesList, 
    fetchCountryByCode, 
    countryPending, 
    countryError, 
    countryData
  };
};


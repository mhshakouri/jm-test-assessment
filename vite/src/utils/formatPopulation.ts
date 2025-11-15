/**
 * Format population number for display
 */
export const formatPopulation = (population: number | 'N/A' | undefined | null): string => {
  if (population === "N/A" || population === undefined || population === null || population === 0) {
    return "N/A";
  }
  return typeof population === "number" ? population.toLocaleString("en-US") : "N/A";
};


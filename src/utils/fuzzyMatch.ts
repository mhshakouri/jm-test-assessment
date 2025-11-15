/**
 * Fuzzy matching function that checks if characters in the query
 * appear in order within the text (case-insensitive).
 * 
 * Examples:
 * - "grmany" matches "Germany" (g-r-m-a-n-y appear in order)
 * - "grmny" matches "Germany" (g-r-m-n-y appear in order)
 * - "usa" matches "United States of America" (u-s-a appear in order)
 */
export const fuzzyMatch = (query: string, text: string): boolean => {
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


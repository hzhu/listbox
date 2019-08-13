const API_URL = "https://staging-api.shipt.com/autocomplete/v1/suggestions";

export const fetchPopularTerms = async () => {
  const response = await fetch(`${API_URL}?store_id=27`);
  const data = await response.json();
  return data.suggestions.map(s => s.term);
}

export const fetchSuggestedTerms = async query => {
  const response = await fetch(`${API_URL}/${query}?store_id=27`);
  const data = await response.json();
  return data.suggestions.map(s => s.term);
};

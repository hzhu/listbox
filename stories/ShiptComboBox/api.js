const API_URL = "http://api.edamam.com/auto-complete";

export const fetchSuggestedTerms = async query => {
  const response = await fetch(
    `${API_URL}?q=${query}&limit=5&app_id=6a515083&app_key=9abc6f025da04139635498403e733c70`
  );
  return await response.json();
};

import React, { useState } from "react";
// Si estás usando lucide-react para iconos, importa el icono Search
// import { Search } from "lucide-react";
// Si no, puedes usar un emoji o texto simple

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === "") return;
    
    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);
    // Aquí puedes hacer la llamada a tu API
    
    try {
      // Ejemplo usando la API de JSONPlaceholder - reemplaza con tu API
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Buscar algo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSubmit}
          className="search-input"
        />
        <button 
          onClick={handleSearch}
          className="search-button"
        >
          {/* Si no usas lucide-react, puedes usar texto o emoji */}
          {/* <Search size={16} className="search-icon" /> */}
          🔍 Buscar
        </button>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {searchPerformed && !isLoading && results.length === 0 && !error && (
        <div className="no-results-message">
          No se encontraron resultados para "{query}"
        </div>
      )}

      {results.length > 0 && (
        <div className="results-container">
          <h2 className="results-title">Resultados ({results.length})</h2>
          <ul className="results-list">
            {results.map((item) => (
              <li key={item.id} className="result-item">
                <h3 className="result-title">{item.title}</h3>
                <p className="result-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
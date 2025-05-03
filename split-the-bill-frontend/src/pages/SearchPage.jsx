// src/components/SearchPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/Searchbar";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/users?search=${query}`);
      const filtered = res.data.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Users</h2>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
export default SearchPage;

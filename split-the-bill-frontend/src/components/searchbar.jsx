import React, { useState } from "react";

// Search icon component
const SearchIcon = () => (
  <svg
    className="search-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <SearchIcon />
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a contact"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* Hidden submit button to allow form submission on Enter key */}
        <button type="submit" style={{ display: "none" }}></button>
      </form>
    </div>
  );
};

export default SearchBar;

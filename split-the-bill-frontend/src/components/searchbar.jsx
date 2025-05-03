import React, { useState } from "react";

const SearchBar =({onSearch}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(query.trim()==="")return; 
    onSearch(query);
  };

    return (
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Search user"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
  );
};
export default SearchBar;
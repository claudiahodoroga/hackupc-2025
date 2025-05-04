import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

const FriendsList = ({ onFriendSelect, selectedFriends }) => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/friends/6");
        setFriends(response.data);
        setFilteredFriends(response.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // Handle search filtering component
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredFriends(friends);
      return;
    }

    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  if (loading) return <div className="loading-spinner">Loading friends...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="friends-list-container">
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
        <button className="ai-button">
          <span className="sparkle-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3 6 6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L3 9l6-1 3-6z"></path>
            </svg>
          </span>
          Try telling the AI
        </button>
      </div>

      <div className="friends-card">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend.id} className="friend-row">
              <input
                type="checkbox"
                className="friend-checkbox"
                checked={selectedFriends[friend.id] || false}
                onChange={() => onFriendSelect(friend.id)}
              />
              <div className="friend-avatar"></div>
              <div className="friend-info">
                <div className="friend-name">{friend.name}</div>
                <div className="friend-phone">{friend.phone}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-friends-message">No friends found</div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;

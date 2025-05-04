import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

const FriendsList = ({ onFriendSelect, selectedFriends, onLoadFriends }) => {
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

        if (onLoadFriends) {
          onLoadFriends(response.data); // Send data up to parent
        }
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

"use client";

import React, { useState, useEffect } from "react";

const FriendsList = ({ onFriendSelect, selectedFriends, onLoadFriends, filter = "" }) => {
  const [friends, setFriends] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/friends");
        const data = await response.json();
        setFriends(data.friends);
        setOwnerId(data.user.id);
        if (onLoadFriends) {
          onLoadFriends(data.friends);
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

  const displayName = (friend) =>
    friend.id === ownerId ? "You" : friend.name;

  const filteredFriends = filter.trim()
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(filter.toLowerCase()) ||
          displayName(friend).toLowerCase().includes(filter.toLowerCase())
      )
    : friends;

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
                <div className="friend-name">{displayName(friend)}</div>
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

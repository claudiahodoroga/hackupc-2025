import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FoodItemList from "../components/FoodItemList";
import SearchBar from "../components/SearchBar";

// Sample data for the friends list
const friendsData = [
  { name: "Lila Landa", phone: "+34 612 345 678" },
  { name: "Jhon", phone: "+34 612 345 678" },
  { name: "Ferran", phone: "+34 612 345 678" },
];

// Icons components
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

const SparkleIcon = () => (
  <svg
    className="sparkle-icon"
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
);

const PenIcon = () => (
  <svg
    className="pen-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const BillSummaryPage = () => {
  const location = useLocation();

  // Use data from navigation state if available, otherwise use sample data
  const billData = location.state?.billData || {
    items: [
      { name: "Burger", price: 9.5 },
      { name: "Fries", price: 4.0 },
      { name: "HotDog", price: 7.5 },
      { name: "Coke", price: 2.6 },
    ],
    total: 23.6,
  };

  const [selectedFriends, setSelectedFriends] = useState({});

  const handleFriendSelect = (friendName) => {
    setSelectedFriends((prev) => ({
      ...prev,
      [friendName]: !prev[friendName],
    }));
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Add search functionality here
  };

  const handleEditItems = () => {
    console.log("Edit items clicked");
    // Add edit functionality here
  };

  return (
    <div className="app-container">
      <div className="header-area">
        <h1>Split the bill</h1>
        <div className="search-container">
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search for a contact" />
          </div>
          <button className="ai-button">
            <SparkleIcon />
            Try telling the AI
          </button>
        </div>
      </div>

      <div className="items-section">
        <div className="subtitle">
          <span>Items</span>
          <button className="edit-button" onClick={handleEditItems}>
            <PenIcon />
            Edit
          </button>
        </div>

        <div className="items-card">
          {billData.items.map((item, index) => (
            <div key={index} className="item-row">
              <span className="item-name">{item.name}</span>
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="total-amount">Total : ${billData.total.toFixed(2)}</div>
      </div>

      <div className="friends-section">
        <h2>Select friends to split with</h2>
        <div className="friends-card">
          {friendsData.map((friend, index) => (
            <div key={index} className="friend-row">
              <input
                type="checkbox"
                className="friend-checkbox"
                checked={selectedFriends[friend.name] || false}
                onChange={() => handleFriendSelect(friend.name)}
              />
              <div className="friend-avatar"></div>
              <div className="friend-info">
                <div className="friend-name">{friend.name}</div>
                <div className="friend-phone">{friend.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer">
        <button className="cancel-button">Cancel</button>
        <button className="accept-button">Accept</button>
      </div>
    </div>
  );
};

export default BillSummaryPage;

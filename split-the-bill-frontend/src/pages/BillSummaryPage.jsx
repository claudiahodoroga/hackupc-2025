import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FoodItemList from "../components/FoodItemList";
import SearchBar from "../components/SearchBar";
import FriendsList from "../components/FriendsList";
import "../assets/styles/BillSummaryPage.css";

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

  // State to track the currently selected item
  const [selectedItemId, setSelectedItemId] = useState(null);

  // State to track which friends are selected for each item
  const [itemAssignments, setItemAssignments] = useState({});

  // Handle item selection
  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
  };

  // Handle friend selection for the currently selected item
  const handleFriendSelect = (friendId) => {
    if (selectedItemId === null) {
      // If no item is selected, don't do anything
      return;
    }

    setItemAssignments((prev) => {
      // Get the current friends for this item or initialize an empty object
      const currentItemFriends = prev[selectedItemId] || {};

      // Toggle the selected state of this friend for this item
      return {
        ...prev,
        [selectedItemId]: {
          ...currentItemFriends,
          [friendId]: !currentItemFriends[friendId],
        },
      };
    });
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Add search functionality here
  };

  const handleEditItems = () => {
    console.log("Edit items clicked");
    // Add edit functionality here
  };

  // Prepare data for the next page
  const handleAccept = () => {
    // Create a data structure for who pays what
    const paymentData = {
      items: billData.items.map((item, index) => {
        // Get friends assigned to this item
        const assignedFriends = Object.keys(
          itemAssignments[index] || {}
        ).filter((friendId) => itemAssignments[index][friendId]);

        return {
          ...item,
          paidBy: assignedFriends,
          splitAmount:
            assignedFriends.length > 0
              ? item.price / assignedFriends.length
              : item.price,
        };
      }),
      total: billData.total,
    };

    console.log("Payment data:", paymentData);
    // Here you would navigate to the next page with this data
    // history.push('/payment-summary', { paymentData });
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
          <span>
            Items
            {selectedItemId !== null
              ? ` (Select who's paying for ${billData.items[selectedItemId].name})`
              : ""}
          </span>
          <button className="edit-button" onClick={handleEditItems}>
            <PenIcon />
            Edit
          </button>
        </div>

        <FoodItemList
          items={billData.items}
          total={billData.total}
          selectedItemId={selectedItemId}
          onSelectItem={handleItemSelect}
        />
      </div>

      <div className="friends-section">
        <h2>
          {selectedItemId !== null
            ? `Select friends who will pay for ${billData.items[selectedItemId].name}`
            : "Select an item first"}
        </h2>
        <FriendsList
          onFriendSelect={handleFriendSelect}
          selectedFriends={
            selectedItemId !== null ? itemAssignments[selectedItemId] || {} : {}
          }
        />
      </div>

      <div className="footer">
        <button className="cancel-button">Cancel</button>
        <button className="accept-button" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default BillSummaryPage;

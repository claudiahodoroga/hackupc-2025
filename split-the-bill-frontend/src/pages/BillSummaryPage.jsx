import React from "react";
import { useLocation } from "react-router-dom";
import FoodItemList from "../components/FoodItemList"; // Adjust path if needed

// --- Placeholder Data for Testing ---
const placeholderData = {
  items: [
    { name: "Placeholder Burger", price: 12.99 },
    { name: "Placeholder Fries", price: 4.5 },
    { name: "Placeholder Soda", price: 2.0 },
  ],
  total: 19.49,
};

const BillSummaryPage = () => {
  const location = useLocation();
  // Use data from navigation state if available, otherwise use placeholder
  const billData = location.state?.billData || placeholderData;

  // Ensure billData and billData.items exist before rendering FoodItemList
  if (!billData || !billData.items) {
    // Handle case where data is missing or invalid (optional)
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Bill Summary</h1>
        <p className="text-red-500">Error: Bill data not found.</p>
        {/* Optionally show placeholder data even on error */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Placeholder Items</h2>
        <FoodItemList
          items={placeholderData.items}
          total={placeholderData.total}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Bill Summary</h1>
      {/* Pass the items and total to FoodItemList */}
      <FoodItemList items={billData.items} total={billData.total} />

      {/* Add other functionalities like splitting the bill later */}
      <div className="mt-6 text-center">
        {/* Add buttons or components for splitting */}
      </div>
    </div>
  );
};

export default BillSummaryPage;

import React from "react";

// This component expects an array of items and a total number
const FoodItemList = ({ items = [], total = 0 }) => {
  // Added default values
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">Item List</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        {" "}
        {/* Adjusted rounding */}
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">
            No items found on the bill.
          </p>
        ) : (
          <div className="flex flex-col space-y-2">
            {" "}
            {/* Reduced spacing */}
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                {" "}
                {/* Smaller text */}
                <span className="text-gray-700">
                  {item.name || "Unnamed Item"}
                </span>{" "}
                {/* Handle missing name */}
                {/* Ensure price is formatted correctly */}
                <span className="text-gray-900 font-medium">
                  $
                  {(typeof item.price === "number" ? item.price : 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Only show total if there are items */}
      {items.length > 0 && (
        <div className="mt-3 text-right text-lg font-semibold">
          {" "}
          {/* Adjusted margin and weight */}
          Total: ${(typeof total === "number" ? total : 0).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default FoodItemList;

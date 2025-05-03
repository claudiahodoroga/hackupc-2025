import React from "react";

const FoodItemList = ({ items, total }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">Item List</h2>
      <div className="bg-white shadow-md rounded-2xl p-4">
        <div className="flex flex-col space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-base">
              <span className="text-gray-800">{item.name}</span>
              <span className="text-gray-800">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-right text-lg font-bold">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default FoodItemList;

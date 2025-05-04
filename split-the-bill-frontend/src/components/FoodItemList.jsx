import React from "react";

const FoodItemList = ({
  items = [],
  total = 0,
  selectedItemId,
  onSelectItem,
}) => {
  return (
    <div className="items-section">
      <div className="items-card">
        {items.length === 0 ? (
          <p className="no-items">No items found on the bill.</p>
        ) : (
          <>
            {items.map((item, index) => (
              <div
                key={index}
                className={`item-row ${
                  selectedItemId === index ? "selected-item" : ""
                }`}
                onClick={() => onSelectItem(index)}
              >
                <span className="item-name">{item.name || "Unnamed Item"}</span>
                <span className="item-price">
                  $
                  {(typeof item.price === "number" ? item.price : 0).toFixed(2)}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="total-amount">
          Total: ${(typeof total === "number" ? total : 0).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default FoodItemList;

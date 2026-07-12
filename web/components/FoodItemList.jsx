import React from "react";
import { X } from "lucide-react";

const FoodItemList = ({
  items = [],
  selectedItemId,
  onSelectItem,
  editing = false,
  onChangeItem,
  onRemoveItem,
}) => {
  return (
    <div className="items-section">
      <div className="items-card">
        {items.length === 0 ? (
          <p className="no-items">No items found on the bill.</p>
        ) : editing ? (
          items.map((item, index) => (
            <div key={index} className="item-edit-row">
              <input
                className="item-edit-name"
                type="text"
                value={item.name}
                aria-label="Item name"
                onChange={(e) => onChangeItem(index, "name", e.target.value)}
              />
              <input
                className="item-edit-qty"
                type="number"
                min="1"
                value={item.qty ?? 1}
                aria-label="Quantity"
                onChange={(e) => onChangeItem(index, "qty", e.target.value)}
              />
              <input
                className="item-edit-price"
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                aria-label="Line total"
                onChange={(e) => onChangeItem(index, "price", e.target.value)}
              />
              <button
                className="item-remove-button"
                onClick={() => onRemoveItem(index)}
                aria-label={`Remove ${item.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className={`item-row ${
                selectedItemId === index ? "selected-item" : ""
              }`}
              onClick={() => onSelectItem(index)}
            >
              <span className="item-name">
                {(item.qty ?? 1) > 1 && (
                  <span className="item-qty-label">{item.qty}×</span>
                )}
                {item.name || "Unnamed Item"}
              </span>
              <span className="item-price">
                $
                {(typeof item.price === "number" ? item.price : 0).toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodItemList;

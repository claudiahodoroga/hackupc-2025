"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check } from "lucide-react";
import FoodItemList from "@/components/FoodItemList";
import FriendsList from "@/components/FriendsList";
import VoiceRecorder from "@/components/VoiceRecorder";

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

const BillSummaryPage = () => {
  const router = useRouter();
  const [billData, setBillData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemAssignments, setItemAssignments] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("billData");
    if (stored) {
      setBillData(JSON.parse(stored));
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!billData) return null;

  const persistBill = (next) => {
    setBillData(next);
    sessionStorage.setItem("billData", JSON.stringify(next));
  };

  const recomputeTotal = (items) =>
    items.reduce(
      (sum, item) => sum + (typeof item.price === "number" ? item.price : 0),
      0
    );

  const handleChangeItem = (index, field, value) => {
    const items = billData.items.map((item, i) => {
      if (i !== index) return item;
      if (field === "name") return { ...item, name: value };
      if (field === "qty")
        return { ...item, qty: Math.max(1, parseInt(value, 10) || 1) };
      return { ...item, price: Math.max(0, parseFloat(value) || 0) };
    });
    persistBill({ ...billData, items, total: recomputeTotal(items) });
  };

  const handleRemoveItem = (index) => {
    const items = billData.items.filter((_, i) => i !== index);
    persistBill({ ...billData, items, total: recomputeTotal(items) });
    // Assignments are keyed by item index, so shift them past the removal
    setItemAssignments((prev) => {
      const next = {};
      for (const [key, value] of Object.entries(prev)) {
        const i = Number(key);
        if (i < index) next[i] = value;
        else if (i > index) next[i - 1] = value;
      }
      return next;
    });
    setSelectedItemId(null);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleFriendSelect = (friendId) => {
    if (selectedItemId === null) return;

    setItemAssignments((prev) => {
      const currentItemFriends = prev[selectedItemId] || {};
      return {
        ...prev,
        [selectedItemId]: {
          ...currentItemFriends,
          [friendId]: !currentItemFriends[friendId],
        },
      };
    });
  };

  // Apply {productName: [friendNames]} coming back from the voice API
  const handleVoiceAssignments = (assignments, transcript) => {
    setShowVoiceModal(false);
    const nameToId = new Map(friends.map((f) => [f.name.toLowerCase(), f.id]));
    const next = {};
    billData.items.forEach((item, index) => {
      const names = assignments[item.name];
      if (!names) return;
      const friendFlags = {};
      names.forEach((name) => {
        const id = nameToId.get(name.toLowerCase());
        if (id !== undefined) friendFlags[id] = true;
      });
      if (Object.keys(friendFlags).length > 0) next[index] = friendFlags;
    });
    setItemAssignments((prev) => ({ ...prev, ...next }));
    setVoiceNotice(
      Object.keys(next).length > 0
        ? `AI assigned ${Object.keys(next).length} item(s) from: “${transcript.trim()}”`
        : "The AI couldn't match anything from the recording. Try again or assign manually."
    );
  };

  const handleAccept = () => {
    const paymentData = {
      items: billData.items.map((item, index) => {
        const assignedFriendIds = Object.keys(itemAssignments[index] || {}).filter(
          (friendId) => itemAssignments[index][friendId]
        );
        const assignedFriendNames = assignedFriendIds.map((id) => {
          const friend = friends.find((f) => String(f.id) === String(id));
          return friend ? friend.name : `Unknown (ID: ${id})`;
        });

        return {
          ...item,
          paidBy: assignedFriendNames,
          splitAmount:
            assignedFriendNames.length > 0
              ? item.price / assignedFriendNames.length
              : item.price,
        };
      }),
      total: billData.total,
    };

    sessionStorage.setItem("paymentData", JSON.stringify(paymentData));
    router.push("/final");
  };

  const productsForVoice = Object.fromEntries(
    billData.items.map((item) => [item.name, item.price])
  );

  return (
    <div className="app-container">
      <div className="header-area">
        <h1>Split the bill</h1>
      </div>

      <div className="items-section">
        <div className="subtitle">
          <span>Items</span>
          <div className="subtitle-actions">
            <button className="ai-button" onClick={() => setShowVoiceModal(true)}>
              <SparkleIcon />
              Try telling the AI
            </button>
            <button className="edit-button" onClick={() => setEditing(!editing)}>
              {editing ? <Check size={17} /> : <Pencil size={17} />}
              {editing ? "Done" : "Edit"}
            </button>
          </div>
        </div>

        <FoodItemList
          items={billData.items}
          selectedItemId={selectedItemId}
          onSelectItem={handleItemSelect}
          editing={editing}
          onChangeItem={handleChangeItem}
          onRemoveItem={handleRemoveItem}
        />

        <div className="search-total-row">
          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search for a contact"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="total-amount">
            Total · ${billData.total.toFixed(2)}
          </div>
        </div>
      </div>

      {voiceNotice && <div className="voice-notice">{voiceNotice}</div>}

      <div className="friends-section">
        <h2>
          {selectedItemId !== null
            ? `Select friends who will pay for ${billData.items[selectedItemId].name}`
            : "Select friends to split with"}
        </h2>
        <FriendsList
          onFriendSelect={handleFriendSelect}
          selectedFriends={
            selectedItemId !== null ? itemAssignments[selectedItemId] || {} : {}
          }
          onLoadFriends={setFriends}
          filter={searchQuery}
        />
      </div>

      <div className="footer">
        <button className="cancel-button" onClick={() => router.push("/")}>
          Cancel
        </button>
        <button className="accept-button" onClick={handleAccept}>
          Accept
        </button>
      </div>

      {showVoiceModal && (
        <VoiceRecorder
          products={productsForVoice}
          onAssignments={handleVoiceAssignments}
          onClose={() => setShowVoiceModal(false)}
        />
      )}
    </div>
  );
};

export default BillSummaryPage;

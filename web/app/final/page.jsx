"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check } from "lucide-react";

const DEMO_USER_NAME = "Marco";

const FinalViewPage = () => {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [sent, setSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("paymentData");
    if (stored) {
      setPaymentData(JSON.parse(stored));
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!paymentData) return null;

  // Build the per-person breakdown
  const personMap = {};
  paymentData.items.forEach((item) => {
    if (!item.paidBy || item.paidBy.length === 0) return;

    item.paidBy.forEach((person) => {
      if (!personMap[person]) {
        personMap[person] = { items: [], total: 0 };
      }
      personMap[person].items.push(item.name);
      personMap[person].total += item.splitAmount;
    });
  });

  const handleEdit = () => {
    router.push("/summary");
  };

  const handleSend = () => {
    // Demo prototype: payment requests are simulated
    setSent(true);
    setShowSuccess(true);
  };

  return (
    <div className="app-container">
      <div className="header-area">
        <h1>Review bill</h1>
        <div className="subtitle">
          <span>Summary</span>
          <button className="edit-button" onClick={handleEdit}>
            <Pencil size={14} />
            Edit
          </button>
        </div>
      </div>

      <div className="items-card">
        {Object.keys(personMap).length > 0 ? (
          Object.entries(personMap).map(([name, data], index) => (
            <div key={index} className="person-row">
              <div className="person-avatar"></div>
              <div className="person-details">
                <div className="person-name">
                  {name === DEMO_USER_NAME ? "You" : name}
                </div>
                <div className="person-items">{data.items.join(", ")}</div>
              </div>
              <div className="person-total">${data.total.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div className="no-assignments">
            No items have been assigned to any friends yet
          </div>
        )}
      </div>

      <div className="footer">
        <button className="cancel-button" onClick={() => router.push("/summary")}>
          Back
        </button>
        <button className="accept-button" onClick={handleSend} disabled={sent}>
          {sent ? "Requests sent" : "Send requests"}
        </button>
      </div>

      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-card">
            <div className="success-check">
              <Check size={44} strokeWidth={2.5} />
            </div>
            <div className="success-text">
              Bill requests successfully sent to your contacts
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalViewPage;

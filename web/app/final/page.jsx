"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FinalViewPage = () => {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [sent, setSent] = useState(false);

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

  const handleBack = () => {
    router.back();
  };

  const handleSend = () => {
    // Demo prototype: payment requests are simulated
    setSent(true);
  };

  return (
    <div className="app-container">
      <div className="header-area">
        <h1>Review bill</h1>
        <div className="subtitle">
          <span>Summary</span>
        </div>
      </div>

      <div className="items-card">
        {Object.keys(personMap).length > 0 ? (
          Object.entries(personMap).map(([name, data], index) => (
            <div
              key={index}
              className="item-row"
              style={{ alignItems: "flex-start", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span style={{ fontWeight: "600" }}>{name}</span>
                <span style={{ fontWeight: "500" }}>
                  ${data.total.toFixed(2)}
                </span>
              </div>
              <span style={{ fontSize: "14px", color: "#777f89" }}>
                {data.items.join(", ")}
              </span>
            </div>
          ))
        ) : (
          <div className="no-assignments">
            No items have been assigned to any friends yet
          </div>
        )}
      </div>

      {sent && (
        <div className="success-message">
          <p>Payment requests sent! (demo — no real requests are made)</p>
        </div>
      )}

      <div className="footer">
        <button className="cancel-button" onClick={handleBack}>
          Back
        </button>
        <button className="accept-button" onClick={handleSend} disabled={sent}>
          {sent ? "Requests sent" : "Send requests"}
        </button>
      </div>
    </div>
  );
};

export default FinalViewPage;

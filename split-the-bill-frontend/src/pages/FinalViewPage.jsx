import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/BillSummaryPage.css"; // Reuse styles

const FinalViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentData } = location.state || {};

  useEffect(() => {
    // Debug the received data
    console.log("Received payment data in FinalViewPage:", paymentData);
  }, [paymentData]);

  if (!paymentData) {
    return <div>No bill data available</div>;
  }

  // Build the per-person breakdown
  const personMap = {};

  paymentData.items.forEach((item) => {
    console.log(`Processing item ${item.name} with paidBy:`, item.paidBy);

    if (!item.paidBy || item.paidBy.length === 0) {
      console.log(`No payers assigned to ${item.name}`);
      return;
    }

    item.paidBy.forEach((person) => {
      console.log(`Adding ${item.name} to ${person}'s tab`);

      if (!personMap[person]) {
        personMap[person] = {
          items: [],
          total: 0,
        };
      }

      personMap[person].items.push(item.name);
      personMap[person].total += item.splitAmount;
    });
  });

  console.log("Final person map:", personMap);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSend = () => {
    console.log("Sending requests...");
    // Send request logic here
  };

  return (
    <div className="app-container">
      <div className="header-area">
        <h1>Review bill</h1>
        <div className="subtitle">
          <span>Summary</span>
          <button className="edit-button">Edit</button>
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

      <div className="footer">
        <button className="cancel-button" onClick={handleBack}>
          Back
        </button>
        <button className="accept-button" onClick={handleSend}>
          Send requests
        </button>
      </div>
    </div>
  );
};

export default FinalViewPage;

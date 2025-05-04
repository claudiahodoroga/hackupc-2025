import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScanBillPage from "./pages/ScanBillPage"; // Adjust path as needed
import BillSummaryPage from "./pages/BillSummaryPage"; // Adjust path as needed
import FinalViewPage from "./pages/FinalViewPage";
import "./index.css"; // Import reset and variables CSS first
import "./App.css"; // Import main application CSS

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<ScanBillPage />} />
          {/* Route for the scan page */}
          <Route path="/scan" element={<ScanBillPage />} />
          {/* Route for the summary page */}
          <Route path="/BillSummaryPage" element={<BillSummaryPage />} />
          {/* Add other routes as needed */}
          <Route path="/FinalViewPage" element={<FinalViewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScanBillPage from "./pages/ScanBillPage"; // Adjust path as needed
import BillSummaryPage from "./pages/BillSummaryPage"; // Adjust path as needed
import "./App.css"; // Or your main CSS file

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {" "}
        {/* Basic layout */}
        <Routes>
          {/* Default route */}

          {/* Route for the summary page */}
          <Route path="/BillSummaryPage" element={<BillSummaryPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

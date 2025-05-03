import { useState } from "react";
import ScanBillPage from "./pages/RecordAudioPage";
import "./App.css";
import RecordingAudioPage from "./pages/RecordAudioPage";

function App() {
  return (
    <div>
      <h1> Upload a recording of your bill</h1>
        <RecordingAudioPage />
    </div>
  );
}

export default App;

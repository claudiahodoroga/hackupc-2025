import { useState } from "react";
import "./App.css";
import RecordingAudioPage from "./pages/RecordAudioPage";
import ScanBillPage from "./pages/ScanBillPage";

function App() {
  return (
    <div>
      <h1> Upload a recording of your bill</h1>
      {/*<RecordingAudioPage />*/}
      <ScanBillPage />
    </div>
  );
}

export default App;

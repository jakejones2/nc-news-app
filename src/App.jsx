import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Feed } from "./app/Feed";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div id="app">
      <Routes>
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </div>
  );
}

export default App;

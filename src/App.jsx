import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Feed } from "./app/Feed";
import { Nav } from "./app/Nav";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div id="app">
      <h1 id="app-title">NC-NEWS</h1>
      <Nav />
      <Routes>
        <Route path="/" element={<Feed />} />
      </Routes>
    </div>
  );
}

export default App;

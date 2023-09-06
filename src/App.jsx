import { Routes, Route } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import "./App.css";
import { Feed } from "./app/Feed";
import { Nav } from "./app/Nav";
import { Article } from "./app/Article";
import { SignUp } from "./app/SignUp";
import { Login } from "./app/Login";

function App() {
  useEffect(() => {}, []);
  return (
    <div id="app">
      <h1 id="app-title">NC-NEWS</h1>
      <Nav />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/:topic" element={<Feed />} />
        <Route path="/articles/:id" element={<Article />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

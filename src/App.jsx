import { Routes, Route, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import "./App.css";
import { Feed } from "./app/Feed";
import { Nav } from "./app/Nav";
import { Article } from "./app/Article";
import { SignUp } from "./app/SignUp";
import { Login } from "./app/Login";
import { Post } from "./app/Post";
import { Profile } from "./app/Profile";
import { NotFound } from "./app/NotFound";

function App() {
  useEffect(() => {}, []);
  return (
    <div id="app">
      <Link to="/articles?limit=10&page=1&author=&sortBy=created_at&topic=&order=asc">
        <h1 id="app-title">NC-NEWS</h1>
      </Link>
      <Nav />
      <Routes>
        <Route path="/articles" element={<Feed />} />
        <Route path="/articles/:topic" element={<Feed />} />
        <Route path="/articles/:id" element={<Article />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

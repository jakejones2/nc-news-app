import { Routes, Route, Link } from "react-router-dom";
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
  return (
    <div id="app">
      <a href="/">
        <h1 id="app-title">Daily Express.js</h1>
      </a>
      <Nav />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/articles" element={<Feed />} />
        <Route path="/article/:id" element={<Article />} />
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

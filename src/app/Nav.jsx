import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts";
import { getLogout } from "../api";
import Cookies from "js-cookie";

export function Nav() {
  const { setUser, user } = useContext(UserContext);
  const [loggingOut, setLoggingOut] = useState(false);
  function logout() {
    setLoggingOut(true);
    getLogout()
      .then(() => {
        setUser({ username: "guest", token: "" });
        Cookies.remove("username");
        Cookies.remove("jwt");
        setLoggingOut(false);
      })
      .catch((err) => {
        console.log(err);
        setLoggingOut(false);
      });
  }

  return (
    <>
      <nav id="nav-main">
        <Link to="/" className="nav-link" id="feed">
          Feed
        </Link>
        {user.username !== "guest" && (
          <div className="logged-in-nav-items">
            <Link to="/post" className="nav-link" id="post">
              Post
            </Link>
            <Link to="/profile" className="nav-link" id="profile">
              Profile
            </Link>
            {loggingOut ? (
              <span className="loader logout-loader"></span>
            ) : (
              <button onClick={logout} id="logout" className="nav-link end">
                Log Out
              </button>
            )}
          </div>
        )}
        {user.username === "guest" && (
          <div className="guest-nav-items">
            <Link to="/login" className="nav-link" id="login">
              Log In
            </Link>
            <Link to="/signup" className="nav-link end" id="signup">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
      {user.username !== "guest" && (
        <p id="welcome-user">
          Logged in as <span id="user">{user.username}</span>
        </p>
      )}
    </>
  );
}

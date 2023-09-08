import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext, logoutUser } from "../contexts";
import { getLogout } from "../api";
import { ConfirmationModal } from "./Reuse/ConfirmationModal";

export function Nav() {
  const { setUser, user } = useContext(UserContext);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  function logout() {
    setLoggingOut(true);
    getLogout()
      .then(() => {
        logoutUser(setUser);
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
        <a href="/" className="nav-link">
          Feed
        </a>
        {user.username !== "guest" && (
          <div className="logged-in-nav-items">
            <Link to="/post" className="nav-link" id="post">
              Post
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="nav-link"
              id="profile"
            >
              Profile
            </Link>
            {loggingOut ? (
              <span className="loader logout-loader"></span>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                id="logout"
                className="nav-link end"
              >
                Log Out
              </button>
            )}
            {showLogoutModal && (
              <ConfirmationModal
                message="Are you sure you want to log out?"
                setShowState={setShowLogoutModal}
                confirmFunction={logout}
                args={[]}
              />
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
          Logged in as{" "}
          <Link to={`/profile/${user.username}`}>
            <span id="user">{user.username}</span>
          </Link>
        </p>
      )}
    </>
  );
}

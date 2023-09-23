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
      <nav className="nav">
        <a href="/" className="nav__link">
          Feed
        </a>
        {user.username !== "guest" && (
          <div className="nav__container">
            <Link to="/post" className="nav__link" id="post">
              Post
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="nav__link"
              id="profile"
            >
              Profile
            </Link>
            {loggingOut ? (
              <span className="loader loader--tiny"></span>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                id="logout"
                className="nav__link nav__link--end nav__link--logout"
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
          <div className="nav__container">
            <Link to="/login" className="nav__link" id="login">
              Log In
            </Link>
            <Link to="/signup" className="nav__link nav__link--end" id="signup">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
      {user.username !== "guest" && (
        <p className="greet">
          Logged in as{" "}
          <Link to={`/profile/${user.username}`}>
            <span className="greet__user">{user.username}</span>
          </Link>
        </p>
      )}
    </>
  );
}

import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { postAuth } from "../api";
import { UserContext } from "../contexts";
import Cookies from "js-cookie";

export function Login() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);

  function handleUsername(event) {
    setUsername(event.target.value);
  }
  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function login(event) {
    event.preventDefault();
    setErrorLoggingIn(false);
    setLoggingIn(true);
    postAuth({ username, password })
      .then((accessToken) => {
        setUser({ username: username, token: accessToken });
        Cookies.set("username", username, { expires: 7 });
        Cookies.set("jwt", accessToken, { expires: 1 });
        setRedirect(true);
      })
      .catch((err) => {
        console.log(err);
        setLoggingIn(false);
        setErrorLoggingIn(true);
      });
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  if (errorLoggingIn) {
    return <div className="articles-error">Something went wrong - sorry!</div>;
  }

  if (loggingIn) {
    return <span className="loader"></span>;
  }

  return (
    <form onSubmit={login} id="login-form">
      <label className="form-label" htmlFor="username">
        Username
      </label>
      <input
        value={username}
        onChange={handleUsername}
        id="username"
        className="form-input"
      ></input>
      <label className="form-label" htmlFor="password">
        Password
      </label>
      <input
        value={password}
        onChange={handlePassword}
        type="password"
        id="password"
        className="form-input"
      ></input>
      <button className="login-button">Log In</button>
    </form>
  );
}

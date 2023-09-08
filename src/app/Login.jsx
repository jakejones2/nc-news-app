import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAuth } from "../api";
import { UserContext } from "../contexts";
import Cookies from "js-cookie";

export function Login() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("tickle122");
  const [password, setPassword] = useState("#pKhMcl&");
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);
  const navigate = useNavigate();

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
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
        setLoggingIn(false);
        setErrorLoggingIn(true);
      });
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
      <p className="form-help login-help">
        Mr tickle122 is our guest profile for exploring the site.
      </p>
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

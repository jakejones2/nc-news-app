import { useState, useEffect } from "react";
import { getArticles, postUser } from "../api";
import { Navigate } from "react-router-dom";

export type SignInState = {
  username: string,
  name: string,
  password: string,
  password2: string,
  avatar_url: string
}

export function SignUp() {
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [password2Incorrect, setPassword2Incorrect] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [submitDeactivated, setSubmitDeactivated] = useState(true);
  const [errorSigningIn, setErrorSigningIn] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [signInData, setSignInData] = useState<SignInState>({
    username: "",
    name: "",
    password: "",
    password2: "",
    avatar_url: "",
  });

  useEffect(() => {
    revealSubmit();
  }, [signInData, password2Incorrect, passwordIncorrect, usernameTaken]);

  function handleUsername(event) {
    setUsernameTaken(false);
    setSubmitDeactivated(true);
    setSignInData((data) => {
      const newData = { ...data };
      newData.username = event.target.value;
      return newData;
    });
  }

  function validateUsername(event) {
    getArticles({ author: event.target.value })
      .then(() => {
        setUsernameTaken(true);
      })
      .catch((err) => {
        setUsernameTaken(false);
      });
  }

  function handleName(event) {
    setSignInData((data) => {
      const newData = { ...data };
      newData.name = event.target.value;
      return newData;
    });
  }

  function handlePassword(event) {
    const regex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (!regex.test(event.target.value)) {
      setPasswordIncorrect(true);
    } else {
      setPasswordIncorrect(false);
    }
    setSignInData((data) => {
      const newData = { ...data };
      newData.password = event.target.value;
      return newData;
    });
  }

  function handlePassword2(event) {
    if (event.target.value !== signInData.password) {
      setPassword2Incorrect(true);
    } else {
      setPassword2Incorrect(false);
    }
    setSignInData((data) => {
      const newData = { ...data };
      newData.password2 = event.target.value;
      return newData;
    });
  }

  function handleAvatarUrl(event) {
    setSignInData((data) => {
      const newData = { ...data };
      newData.avatar_url = event.target.value;
      return newData;
    });
  }

  function revealSubmit() {
    if (
      signInData.username &&
      signInData.name &&
      signInData.password &&
      signInData.password2 &&
      !usernameTaken &&
      !password2Incorrect &&
      !passwordIncorrect
    ) {
      setSubmitDeactivated(false);
    } else setSubmitDeactivated(true);
  }

  function signIn(event) {
    setSigningIn(true);
    event.preventDefault();
    setSubmitDeactivated(true);
    postUser(signInData)
      .then(() => {
        setRedirect(true);
      })
      .catch((err) => {
        console.log(err);
        setSigningIn(false);
        setErrorSigningIn(true);
      });
  }

  if (errorSigningIn) {
    return <div className="error">Something went wrong - sorry!</div>;
  }

  if (signingIn) {
    return <span className="loader"></span>;
  }

  if (redirect) {
    return <Navigate to="/articles" />;
  }

  return (
    <>
      <form onSubmit={signIn} className="form">
        <label className="form__label" htmlFor="username">
          Username
          <span className="form__help">
            Must be unique, try adding some numbers!
          </span>
        </label>
        <input
          value={signInData.username}
          onChange={handleUsername}
          onBlur={validateUsername}
          id="username"
          className="form__input"
        />
        {usernameTaken && <span className="form__validator">❌</span>}
        <label className="form__label" htmlFor="name">
          Name
        </label>
        <input
          value={signInData.name}
          onChange={handleName}
          id="name"
          className="form__input"
        />
        <label className="form__label" htmlFor="password">
          Enter Password
          <span className="form__help">
            Passwords must be longer than 8 characters, and include uppercase,
            lowercase, digits and special characters.
          </span>
        </label>
        <input
          value={signInData.password}
          onChange={handlePassword}
          type="password"
          id="password"
          className="form__input"
        />
        {passwordIncorrect && <span className="form__validator">❌</span>}
        <label className="form__label" htmlFor="password2">
          Enter Password Again
        </label>
        <input
          value={signInData.password2}
          onChange={handlePassword2}
          type="password"
          id="password2"
          className="form__input"
        />
        {password2Incorrect && <span className="form__validator">❌</span>}
        <label className="form__label" htmlFor="password">
          Avatar URL (Optional)
        </label>
        <input
          value={signInData.avatar_url}
          onChange={handleAvatarUrl}
          id="url"
          className="form__input"
        />
        {!submitDeactivated && (
          <button className="form__button">Create User</button>
        )}
      </form>
    </>
  );
}

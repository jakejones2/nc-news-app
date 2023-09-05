export function Login() {
  return (
    <form id="login-form">
      <label className="form-label" htmlFor="username">
        Username
      </label>
      <input id="username" className="form-input"></input>
      <label className="form-label" htmlFor="password">
        Password
      </label>
      <input type="password" id="password" className="form-input"></input>
      <button className="login-button">Log In</button>
    </form>
  );
}

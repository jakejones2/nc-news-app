import { Link } from "react-router-dom";

export function Nav() {
  return (
    <nav id="nav-main">
      <Link to="/" className="nav-link" id="feed">
        Feed
      </Link>
      <Link to="/post" className="nav-link" id="post">
        Post
      </Link>
      <Link to="/orders" className="nav-link" id="profile">
        Profile
      </Link>
      <Link to="/listings" className="nav-link" id="login">
        Login
      </Link>
    </nav>
  );
}

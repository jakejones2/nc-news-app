import { useEffect, useState } from "react";
import { getUser } from "../../api";

export function UserData({ username }) {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    setErrorLoading(false);
    setIsLoading(true);
    getUser(username)
      .then((data) => {
        setUserData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorLoading(true);
      });
  }, []);

  if (errorLoading) {
    return (
      <div className="articles-error">
        Can't fetch {username}'s data right now, sorry!'
      </div>
    );
  }

  if (isLoading) {
    return <span className="loader"></span>;
  }

  return (
    <div id="user-data">
      <h2 id="user-title">{userData.username}</h2>
      <h3 id="user-name">{userData.name}</h3>
      <img id="profile-pic" src={userData.avatar_url} />
    </div>
  );
}

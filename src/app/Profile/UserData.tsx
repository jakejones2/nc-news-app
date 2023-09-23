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
      <div className="error">
        Can't find {username}'s data, do they even exist?'
      </div>
    );
  }

  if (isLoading) {
    return <span className="loader"></span>;
  }

  return (
    <div className="user">
      <h2 className="user__title">{userData.username}</h2>
      <h3 className="user__name">{userData.name}</h3>
      <img className="user__img" src={userData.avatar_url} />
    </div>
  );
}

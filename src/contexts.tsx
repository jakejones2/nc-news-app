import { createContext, useState } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  function findCookie() {
    const username = Cookies.get("username") || "guest";
    const token = Cookies.get("jwt") || "";
    return { username, token };
  }
  const [user, setUser] = useState(findCookie());
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function logoutUser(setUser) {
  setUser({ username: "guest", token: "" });
  Cookies.remove("username");
  Cookies.remove("jwt");
}

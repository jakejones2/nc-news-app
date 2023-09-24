import { createContext, useState } from "react";
import Cookies from "js-cookie";

export interface UserState {
  username: string,
  token: string
}

export interface UserContextInterface {
  user: UserState,
  setUser: React.Dispatch<React.SetStateAction<UserState>>
}

export const UserContext = createContext<UserContextInterface | null>(null);

export const UserProvider = ({ children }) => {
  function findCookie(): UserState {
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

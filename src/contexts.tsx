import { createContext, useState } from "react";
import Cookies from "js-cookie";

export interface UserState {
  username: string,
  token: string
}

export interface UserContextInterface {
  user: UserState,
  setUser: React.Dispatch<React.SetStateAction<UserState>> | ((state: UserState) => {})
}

const defaultUser = {
  user: {username: "guest", token: ""}, 
  setUser: () => {}
}

export const UserContext = createContext<UserContextInterface>(defaultUser);

export const UserProvider = ({ children }: { children: React.ReactNode}) => {
  function findCookie(): UserState {
    const username = Cookies.get("username") || "guest";
    const token = Cookies.get("jwt") || "";
    return { username, token };
  }
  const [user, setUser] = useState<UserState>(findCookie());
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function logoutUser(setUser: React.Dispatch<React.SetStateAction<UserState>>) {
  setUser({ username: "guest", token: "" });
  Cookies.remove("username");
  Cookies.remove("jwt");
}

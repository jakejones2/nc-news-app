import { createContext, useState } from "react";
import Cookies from "js-cookie";

export interface UserState {
  username: string;
  token: string;
}

type SetUserType =
  | React.Dispatch<React.SetStateAction<UserState>>
  | ((state: UserState) => {});

export interface UserContextInterface {
  user: UserState;
  setUser: SetUserType;
}

const defaultUser = {
  user: { username: "guest", token: "" },
  setUser: () => {},
};

export const UserContext = createContext<UserContextInterface>(defaultUser);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
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

export function logoutUser(setUser: SetUserType) {
  setUser({ username: "guest", token: "" });
  Cookies.remove("username");
  Cookies.remove("jwt");
}

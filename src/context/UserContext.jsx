import { createContext, useState } from "react";
import mainBg from "../assets/mainBg.jpg";

export const userContext = createContext("");

export default function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [notifiCounter, setNotifiCounter] = useState(0);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {
      _id: "",
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      photo: `${mainBg}`,
      cover: "",
      bookmarks: [],
      followers: [],
      following: [],
      followersCount: 0,
      followingCount: 0,
      bookmarksCount: 0,
    },
  );
  return (
    <userContext.Provider value={{ token, setToken, userInfo, setUserInfo , notifiCounter , setNotifiCounter }}>
      {children}
    </userContext.Provider>
  );
}

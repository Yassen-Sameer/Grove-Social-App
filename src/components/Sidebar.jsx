import React, { useContext } from "react";
import {
  Home as HomeIcon,
  Bell,
  Bookmark,
  User,
  Settings,
  CirclePlus,
  Users,
} from "lucide-react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router";
import Logout from "./Logout";
import { userContext } from "../context/UserContext";
import scrollToTop from "../utils/ScrollToTopButton";

export default function Sidebar() {
  const { userInfo, notifiCounter } = useContext(userContext);
  return (
    <>
      <header className="lg:hidden fixed md:mt-2.5 top-0 z-50 w-full">
        <div className="sm:px-10 md:max-w-[85%] w-full m-auto bg-[#07110D]/80 border border-white/10 md:rounded-2xl p-3 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                scrollToTop();
              }}
              className="flex gap-1 cursor-pointer"
            >
              {" "}
              <span className="text-[16px] sm:text-xl font-bold tracking-tight text-[#1DB854]">
                GROVE
              </span>
              <img src={logo} alt="logo" className="h-5 sm:h-6 w-auto" />
            </button>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              onClick={() => {
                scrollToTop();
              }}
              className={({ isActive }) =>
                isActive
                  ? "p-2.5 rounded-xl bg-[#1DB854]/10 text-[#1DB854] transition-colors"
                  : "p-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              }
            >
              <HomeIcon className="size-4 sm:size-5" />
            </NavLink>

            <NavLink
              to="foryou"
              className={({ isActive }) =>
                isActive
                  ? "p-2.5 rounded-xl bg-[#1DB854]/10 text-[#1DB854] transition-colors"
                  : "p-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              }
            >
              <Users className="size-4 sm:size-5" />
            </NavLink>

            <NavLink
              to="createPost"
              className={({ isActive }) =>
                isActive
                  ? "p-2.5 rounded-xl bg-[#1DB854]/10 text-[#1DB854] transition-colors"
                  : "p-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              }
            >
              <CirclePlus className="size-4 sm:size-5" />
            </NavLink>

            <NavLink
              to="notifications"
              className={({ isActive }) =>
                isActive
                  ? "p-2.5 rounded-xl bg-[#1DB854]/10 text-[#1DB854] transition-colors relative"
                  : "p-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors relative"
              }
            >
              <Bell className="size-4 sm:size-5" />
              {notifiCounter > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full size-4.5 flex items-center justify-center border-2 border-[#07110D]">
                  {notifiCounter}
                </span>
              )}
            </NavLink>

            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "p-2.5 rounded-xl bg-[#1DB854]/10 text-[#1DB854] transition-colors"
                  : "p-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              }
            >
              <User className="size-4 sm:size-5" />
            </NavLink>
          </nav>

          <Logout />
        </div>
      </header>

      <aside className="hidden z-50 lg:flex flex-col justify-between w-64 bg-[#07110D]/80 border border-white/10 rounded-3xl p-5 backdrop-blur-md h-[calc(100vh-3rem)] fixed left-5 top-[50%] -translate-y-[50%]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-3 pt-2 ">
            <button
              onClick={() => {
                scrollToTop();
              }}
              className="flex gap-1 cursor-pointer"
            >
              <span className="text-2xl font-bold tracking-tight text-[#1DB854] ">
                GROVE
              </span>
              <img src={logo} alt="logo" className="h-7 w-auto" />
            </button>
          </div>

          <nav className="space-y-1.5">
            <NavLink
              onClick={() => {
                scrollToTop();
              }}
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#1DB854]/10 text-[#1DB854] font-medium text-sm transition-colors"
                  : "flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              }
            >
              <HomeIcon className="size-5" />
              Home
            </NavLink>

            <NavLink
              to="foryou"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#1DB854]/10 text-[#1DB854] font-medium text-sm transition-colors"
                  : "flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              }
            >
              <Users className="size-5" />
              For You
            </NavLink>

            <NavLink
              to="createPost"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#1DB854]/10 text-[#1DB854] font-medium text-sm transition-colors"
                  : "flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              }
            >
              <CirclePlus className="size-4 sm:size-5" />
              Create post
            </NavLink>

            <NavLink
              to="notifications"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-between px-4 py-3 rounded-xl bg-[#1DB854]/10 text-[#1DB854] font-medium text-sm transition-colors"
                  : "flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              }
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <Bell className="size-5" />
                </div>
                Notifications
              </div>
              {notifiCounter > 0 && (
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-5 text-center">
                  {notifiCounter}
                </span>
              )}
            </NavLink>

            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#1DB854]/10 text-[#1DB854] font-medium text-sm transition-colors"
                  : "flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              }
            >
              <User className="size-5" />
              Profile
            </NavLink>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 sm:size-12 rounded-full bg-[#112B22] border border-[#1DB854]/40 flex items-center justify-center ">
              <img
                src={userInfo?.photo}
                alt={userInfo.name}
                className=" size-full rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">
                {userInfo.name}
              </p>
              <p className="text-[10px] text-[#8A8F8D]">@{userInfo.username}</p>
            </div>
          </div>
          <Logout />
        </div>
      </aside>
    </>
  );
}

import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import Suggestions from "../components/Suggestions";
import mainBg from "../assets/mainBg.jpg";

export default function Layout() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat relative text-white"
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      <div className="fixed inset-0 bg-black/85 z-0" />

      <Sidebar />

      <main className="relative z-10 w-full lg:pl-72 xl:pr-80 min-h-screen transition-all pt-16 lg:pt-0">
        <Outlet />
      </main>

      <Suggestions />
    </div>
  );
}

import React from "react";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "<span class='text-lg font-bold text-white'>Log Out</span>",
      text: "Are you sure you want to log out of Grove?",
      icon: "warning",
      iconColor: "#1DB854",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#07110D",
      color: "#A3F5C3",
      customClass: {
        popup:
          "border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl",
        title: "text-white font-semibold",
        htmlContainer: "text-xs text-gray-300 mt-2",
        confirmButton:
          "px-5 py-2.5 bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs rounded-xl transition-all active:scale-[0.98] outline-none ml-2 cursor-pointer",
        cancelButton:
          "px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs rounded-xl border border-white/10 transition-all active:scale-[0.98] outline-none cursor-pointer",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/signin");
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors cursor-pointer"
      title="Log Out"
    >
      <LogOut className="size-5" />
    </button>
  );
}

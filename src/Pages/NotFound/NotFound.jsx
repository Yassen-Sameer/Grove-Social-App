import React from "react";
import { Link, useNavigate } from "react-router";
import { Home, ArrowLeft, Compass } from "lucide-react";
import mainBg from "../../assets/mainBg.jpg"

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat relative text-white flex items-center justify-center px-4 sm:px-6 py-10"
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      <div className="fixed inset-0 bg-black/85 z-0" />

      <div className="relative z-10 w-full max-w-md bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="size-16 sm:size-20 rounded-2xl bg-[#1DB854]/10 border border-[#1DB854]/20 flex items-center justify-center mx-auto text-[#1DB854]">
          <Compass className="size-8 sm:size-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            404
          </h1>
          <h2 className="text-base sm:text-lg font-semibold text-white">
            Page not found
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8F8D] max-w-xs mx-auto">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Go back</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-[#1DB854]/20"
          >
            <Home className="size-4" />
            <span>Go home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

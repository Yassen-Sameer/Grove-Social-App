import React, { useContext } from "react";
import Typewriter from "typewriter-effect";
import { Sparkles, Plus, TrendingUp, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import { userContext } from "../context/UserContext";

export default function WelcomeBanner() {
  const navigate = useNavigate();
  const { userInfo } = useContext(userContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const DynamicMessage = () => {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 6) {
      return `Late night thoughts? Share them on <span class="text-[#1DB854] font-extrabold">GROVE</span> <span class="inline-block align-middle ml-1"><img src="${logo}" alt="logo" class="h-6 sm:h-7 w-auto inline-block mb-1" /></span>`;
    } else if (hour >= 6 && hour < 12) {
      return `Start your day by inspiring others on <span class="text-[#1DB854] font-extrabold">GROVE</span> <span class="inline-block align-middle ml-1"><img src="${logo}" alt="logo" class="h-6 sm:h-7 w-auto inline-block mb-1" /></span>`;
    } else if (hour >= 12 && hour < 18) {
      return `What are you working on today? Let <span class="text-[#1DB854] font-extrabold">GROVE</span> know! <span class="inline-block align-middle ml-1"><img src="${logo}" alt="logo" class="h-6 sm:h-7 w-auto inline-block mb-1" /></span>`;
    } else {
      return `Catch up with your community tonight on <span class="text-[#1DB854] font-extrabold">GROVE</span> <span class="inline-block align-middle ml-1"><img src="${logo}" alt="logo" class="h-6 sm:h-7 w-auto inline-block mb-1" /></span>`;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0B140F]/90 backdrop-blur-md border border-white/[0.08] shadow-2xl shadow-black/40 p-5 sm:p-6 space-y-5 transition-all">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1DB854]/50 to-transparent" />
      <div className="absolute -top-24 -right-24 size-48 bg-[#1DB854]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="size-11 sm:size-12 rounded-full p-[1.5px] bg-gradient-to-b from-[#1DB854]/60 to-transparent">
              <img
             
             src={userInfo?.photo || "https://route-posts.routemisr.com/uploads/default-profile.png"}
                alt={userInfo?.name || "User"}
                className="size-full rounded-full object-cover bg-[#112B22]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://route-posts.routemisr.com/uploads/default-profile.png";
                }}
              />
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 bg-[#1DB854] text-[#0A1F18] rounded-full p-0.5 border-2 border-[#0B140F]"
              title="Verified account"
            >
              <ShieldCheck className="size-2.5 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1DB854]">
              {getGreeting()}
            </p>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Welcome back, {userInfo?.name || "Member"}
            </h3>
          </div>
        </div>

        <button
          onClick={() => navigate("createPost")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#1DB854]/10 active:scale-[0.97] cursor-pointer shrink-0"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New post</span>
        </button>
      </div>

      <div className="relative z-10 text-base sm:text-lg md:text-xl font-bold tracking-tight text-white min-h-[60px] flex items-center justify-center text-center py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <Typewriter
          key={Math.floor(new Date().getHours() / 6)}
          onInit={(typewriter) => {
            typewriter
              .typeString(DynamicMessage())
              .start();
          }}
          options={{
            delay: 45,
            cursor: "",
          }}
        />
      </div>

      <div className="relative z-10 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-[#8A8F8D]">
          <Sparkles className="size-3.5 text-[#1DB854]" />
          <span className="text-gray-300">Active and growing community</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#8A8F8D]">
          <TrendingUp className="size-3.5 text-[#1DB854]" />
          <span className="text-gray-200 hidden sm:inline font-medium">
            High engagement today
          </span>
        </div>
      </div>
    </div>
  );
}
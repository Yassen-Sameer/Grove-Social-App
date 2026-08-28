import React from "react";

export default function Loading() {
  return (
    <div className="bg-[#07110D]/80 border border-white/10 rounded-3xl p-5 backdrop-blur-md space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 lg:size-11 rounded-full bg-white/[0.06]" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-2.5 w-32 rounded-full bg-white/[0.04]" />
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="size-4 lg:size-5 rounded-full bg-white/[0.05]" />
          <div className="size-4 lg:size-5 rounded-full bg-white/[0.05]" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full bg-white/[0.05]" />
        <div className="h-2.5 w-4/5 rounded-full bg-white/[0.05]" />
      </div>

      <div className="w-full h-[220px] lg:h-[300px] rounded-2xl bg-white/[0.05]" />

      <div className="flex items-start gap-2 lg:gap-3 border-t border-white/5 pt-3">
        <div className="size-6 lg:size-7 rounded-full bg-white/[0.06] shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-6 w-2/5 rounded-2xl bg-white/[0.05]" />
          <div className="h-2.5 w-1/3 rounded-full bg-white/[0.04]" />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3 pt-2 border-t border-white/5">
        <div className="h-4 w-8 rounded-full bg-white/[0.05]" />
        <div className="h-4 w-8 rounded-full bg-white/[0.05]" />
        <div className="flex-1 h-8 lg:h-9 rounded-full bg-white/[0.04]" />
        <div className="size-8 lg:size-9 rounded-full bg-white/[0.06] shrink-0" />
      </div>
    </div>
  );
}

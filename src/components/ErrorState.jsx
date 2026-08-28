import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl text-center space-y-4 flex flex-col items-center justify-center">
        <div className="size-12 sm:size-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/5">
          <AlertCircle className="size-6 sm:size-7" />
        </div>

        <div className="space-y-1 max-w-xs sm:max-w-sm">
          <h4 className="text-sm sm:text-base font-semibold text-white">
            Something went wrong
          </h4>
          <p className="text-xs sm:text-sm text-[#8A8F8D] leading-relaxed">
            Something happened while loading your feed. Please check your
            connection and try again.
          </p>
        </div>
      </div>
    </div>
  );
}

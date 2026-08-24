"use client";

import React, { useEffect, useState } from "react";
import { Shield, Globe, Send, Key } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MeResponse } from "@/lib/types";

export function Navbar() {
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data: MeResponse) => {
        setMeData(data);
      })
      .catch(() => {
        setMeData({ connected: false, isMock: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const poolSize = meData?.keyPool?.poolSize ?? (meData?.connected ? 1 : 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#07090e]/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/25 flex-shrink-0">
            <Shield className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400">
              Checker
            </span>
          </div>
        </div>

        {/* Right Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Key Pool & Live Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 text-xs font-medium shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                meData?.connected ? "bg-emerald-400" : "bg-emerald-400"
              }`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${
                meData?.connected ? "bg-emerald-500" : "bg-emerald-500"
              }`} />
            </span>
            
            <span className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs font-semibold font-mono">
              {poolSize > 0 ? `${poolSize} Keys` : loading ? "Connecting..." : "Live"}
            </span>
          </div>

          {/* Social Attribution Group */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 hidden lg:inline">
              By <span className="text-slate-900 dark:text-white font-semibold">Vasu</span>
            </span>

            {/* Telegram Link */}
            <a
              href="https://t.me/vasu_tricks"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-lg flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs"
              title="Telegram: @vasu_tricks"
            >
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline font-mono">@vasu_tricks</span>
            </a>

            {/* Website Link */}
            <a
              href="https://vasuu.bond"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-lg flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs"
              title="Website: vasuu.bond"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline font-mono">vasuu.bond</span>
            </a>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

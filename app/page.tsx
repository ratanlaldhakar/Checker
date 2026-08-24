import React from "react";
import { Hero } from "@/components/Hero";
import { CheckerDashboard } from "@/components/CheckerDashboard";
import { ShieldCheck, Zap, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-start">
      {/* Compact Hero Header */}
      <Hero />

      {/* Main Number-First Command Center */}
      <div className="mt-1.5 sm:mt-3">
        <CheckerDashboard />
      </div>

      {/* Bottom Command Center Metrics Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full mt-auto mb-5 sm:mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate">99.9%</div>
              <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Accuracy</div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex-shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 truncate">&lt; 350ms</div>
              <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Latency</div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 shadow-2xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60 flex-shrink-0">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate">21 Live</div>
              <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Platforms</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="text-center pt-3 pb-1 max-w-2xl mx-auto px-4">
      {/* Live Badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-indigo-200/80 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-[11px] font-semibold mb-1.5 shadow-2xs">
        <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
        <span>Multi-Platform Account Verifier</span>
      </div>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
        Check Account Status{" "}
        <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
          in Real Time
        </span>
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
        Instant registration lookup on Meesho, Flipkart, Swiggy, and 21+ supported apps.
      </p>
    </section>
  );
}

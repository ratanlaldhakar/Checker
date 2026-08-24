import React from "react";
import { Clock, Globe, Send, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#07090e]/60 backdrop-blur-sm mt-auto py-5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        
        {/* Left: Branding & Creator Credit */}
        <div className="flex flex-wrap items-center gap-1.5 text-center sm:text-left">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            © {new Date().getFullYear()} Checker
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>
            Crafted by{" "}
            <a
              href="https://vasuu.bond"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors"
            >
              Vasu
            </a>
          </span>
        </div>

        {/* Right: Quick Social & Link Pills */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Website Link */}
          <a
            href="https://vasuu.bond"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>vasuu.bond</span>
          </a>

          {/* Telegram Link */}
          <a
            href="https://t.me/vasu_tricks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span>@vasu_tricks</span>
          </a>
        </div>

      </div>
    </footer>
  );
}

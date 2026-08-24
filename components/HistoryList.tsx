"use client";

import React, { useState } from "react";
import { Inbox, Trash2, Download, Check, ChevronRight, Activity } from "lucide-react";
import { VerificationHistoryItem } from "@/lib/types";
import { maskNumber } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";

interface HistoryListProps {
  items: VerificationHistoryItem[];
  onSelect: (item: VerificationHistoryItem) => void;
  onClear: () => void;
}

export function HistoryList({ items, onSelect, onClear }: HistoryListProps) {
  const [exported, setExported] = useState(false);

  const handleExportCSV = () => {
    if (items.length === 0) return;

    const headers = ["Timestamp", "Platform", "Phone Number", "Status", "Raw Digits"];
    const rows = items.map((item) => [
      `"${item.checkedAt}"`,
      `"${item.serviceName || item.service}"`,
      `"${item.formattedNumber}"`,
      `"${item.registrationStatus === "REGISTERED" ? "Registered" : item.registrationStatus === "DOWN" ? "Service Down" : "Not Registered"}"`,
      `"${item.phoneNumber}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `checker_verifications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
        <Inbox className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" strokeWidth={1.5} />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          No Verification Activity
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
          Checked phone numbers will stream live into this activity ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recent Verifications Feed ({items.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all active:scale-95 shadow-xs"
            title="Export history as CSV spreadsheet"
          >
            {exported ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3 text-slate-400" />
                <span>Export CSV</span>
              </>
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Clear all session verification records"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Activity Table Rows */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs">
        {items.map((item) => {
          const isRegistered = item.registrationStatus === "REGISTERED";
          const isDown = item.registrationStatus === "DOWN";

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    isDown ? "bg-amber-500" : isRegistered ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {maskNumber(item.formattedNumber)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      <BrandLogo slug={item.service} className="w-3 h-3" />
                      <span>{item.serviceName || item.service}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                    {item.checkedAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                    isDown
                      ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
                      : isRegistered
                      ? "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800"
                      : "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  {isDown ? "Down" : isRegistered ? "Registered" : "Fresh Number"}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

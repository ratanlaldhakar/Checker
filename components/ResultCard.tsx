"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Layers,
  Clock,
  Check,
  FileText,
  X,
  AlertTriangle,
  Copy,
  Zap,
} from "lucide-react";
import { VerificationResult } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";

interface ResultCardProps {
  result: VerificationResult;
  onDismiss?: () => void;
}

export function ResultCard({ result, onDismiss }: ResultCardProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const isDown = result.isDown || result.registrationStatus === "DOWN";
  const isRegistered = result.registrationStatus === "REGISTERED";
  const platformName = result.serviceName || result.service;

  const handleCopySummary = () => {
    const statusLabel = isDown
      ? "Service Down / Maintenance"
      : isRegistered
      ? "Registered (Account Exists)"
      : "Unregistered (Fresh Number)";

    const summaryText = `[Checker Verification Report]
Platform: ${platformName}
Phone Number: ${result.formattedNumber}
Status: ${statusLabel}
Checked At: ${result.checkedAt}
Server: SuperAssets Production Engine`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(result.phoneNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 1500);
  };

  return (
    <div
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 backdrop-blur-xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none transition-all animate-fade-in"
    >
      {/* Top Banner Status Bar */}
      <div
        className={`px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDown
            ? "border-amber-200/80 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/30"
            : isRegistered
            ? "border-rose-200/80 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/30"
            : "border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/30"
        }`}
      >
        <div className="flex items-center gap-3">
          {isDown ? (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shadow-xs">
              <AlertTriangle className="w-5 h-5" strokeWidth={2.2} />
            </div>
          ) : isRegistered ? (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shadow-xs">
              <AlertCircle className="w-5 h-5" strokeWidth={2.2} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 block -mb-0.5">
              Live Verification Output
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {isDown
                ? "Service Maintenance"
                : isRegistered
                ? "Account Already Registered"
                : "No Account Found / Fresh"}
            </h4>
          </div>
        </div>

        {/* Status Tag Pill */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            isDown
              ? "bg-amber-100/80 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
              : isRegistered
              ? "bg-rose-100/80 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
              : "bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {isDown ? "Down" : isRegistered ? "Registered" : "Fresh Number"}
        </span>
      </div>

      {/* Description Message */}
      <div className="p-5 space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          {result.message ||
            (isDown
              ? `The ${platformName} checker is temporarily down on SuperAssets.`
              : isRegistered
              ? `This phone number is actively registered on ${platformName}.`
              : `This phone number is not registered on ${platformName}.`)}
        </p>

        {/* 3-Column Key Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              <Layers className="w-3 h-3" />
              <span>Platform</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              <BrandLogo slug={result.service} className="w-4 h-4" />
              <span className="truncate">{platformName}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                <span>Phone</span>
              </span>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedNumber ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
              {result.formattedNumber}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              <Clock className="w-3 h-3" />
              <span>Timestamp</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {result.checkedAt}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-xs"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied Summary</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors px-2.5 py-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

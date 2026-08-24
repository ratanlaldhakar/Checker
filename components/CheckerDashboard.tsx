"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  CornerDownLeft,
  X,
  Smartphone,
  ShieldCheck,
  Radio,
  Key,
} from "lucide-react";
import { formatIndianNumber, isValidIndianMobile } from "@/lib/utils";
import { VerificationResult, VerificationHistoryItem, ServiceItem, MeResponse } from "@/lib/types";
import { FALLBACK_SERVICES } from "@/app/api/services/route";
import { ResultCard } from "./ResultCard";
import { HistoryList } from "./HistoryList";
import { BrandLogo } from "./BrandLogo";

export function CheckerDashboard() {
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  // Meesho is hardcoded as #1 priority default
  const [selectedService, setSelectedService] = useState<string>("meesho");

  const [rawDigits, setRawDigits] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [cooldown, setCooldown] = useState(0);
  const [effectiveCooldownSeconds, setEffectiveCooldownSeconds] = useState(5);
  const [poolSize, setPoolSize] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus phone number input on initial page load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch available services & key pool info
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
      })
      .catch((err) => {
        console.warn("Using fallback services:", err);
      });

    fetch("/api/me")
      .then((res) => res.json())
      .then((data: MeResponse) => {
        if (data.keyPool) {
          setPoolSize(data.keyPool.poolSize || 1);
          setEffectiveCooldownSeconds(data.keyPool.effectiveCooldownSeconds || 5);
        }
      })
      .catch(() => {});
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setRawDigits(val);
    if (error) setError(null);
  };

  const handleClearInput = () => {
    setRawDigits("");
    setError(null);
    inputRef.current?.focus();
  };

  const handleSubmit = async (overrideDigits?: string, overrideService?: string) => {
    const digits = overrideDigits ?? rawDigits;
    const targetService = overrideService ?? selectedService;

    if (!digits) {
      setError("Please enter a 10-digit mobile number.");
      triggerShake();
      inputRef.current?.focus();
      return;
    }

    if (!isValidIndianMobile(digits)) {
      setError("Invalid number. Must be 10 digits starting with 6, 7, 8, or 9.");
      triggerShake();
      inputRef.current?.focus();
      return;
    }

    if (cooldown > 0) {
      setError(`Rate limit active. Please wait ${cooldown}s.`);
      triggerShake();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: targetService,
          number: digits,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && data.retryAfter) {
          setCooldown(data.retryAfter);
        }
        setError(data.error || "Verification failed. Please try again.");
        triggerShake();
        return;
      }

      const result: VerificationResult = data.result;
      setCurrentResult(result);

      // Dynamically set cooldown based on key pool size
      setCooldown(effectiveCooldownSeconds);

      setHistory((prev) => [
        { ...result, timestamp: Date.now() },
        ...prev.filter((h) => !(h.phoneNumber === result.phoneNumber && h.service === result.service)),
      ].slice(0, 15));
    } catch {
      setError("Unable to connect to verification server. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item: VerificationHistoryItem) => {
    setCurrentResult(item);
    setRawDigits(item.phoneNumber);
    if (item.service) {
      setSelectedService(item.service);
    }
  };

  const isValid = isValidIndianMobile(rawDigits);
  const displayValue = formatIndianNumber(rawDigits);

  // Top 5 primary priority platforms
  const TOP_5_SLUGS = ["meesho", "flipkart", "swiggy", "blinkit", "amazon"];
  const topServices = TOP_5_SLUGS.map((slug) => services.find((s) => s.slug === slug)).filter(Boolean) as ServiceItem[];
  const remainingServices = services.filter((s) => !TOP_5_SLUGS.includes(s.slug));

  const currentSelectedObj = services.find((s) => s.slug === selectedService) || services[0] || {
    name: "Meesho",
    slug: "meesho",
    icon: "👗",
  };

  const isSelectedFromDropdown = !TOP_5_SLUGS.includes(selectedService);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-10">
      {/* 2-Column Responsive Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN (lg:col-span-7) - Number-First Control Panel */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg shadow-slate-200/30 dark:shadow-none space-y-4">
            
            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-3.5 sm:space-y-4"
            >
              {/* 1. TOP ELEMENT: Phone Number Input (Number-First Workflow) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Enter Mobile Number</span>
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline flex items-center gap-1 font-mono">
                    <CornerDownLeft className="w-3 h-3" /> Press Enter ↵ to verify
                  </span>
                </div>

                <div
                  className={`flex items-center rounded-xl sm:rounded-2xl border transition-all duration-150 ${
                    error
                      ? "border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/10"
                      : rawDigits.length > 0 && isValid
                      ? "border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/10"
                      : "border-slate-300 dark:border-slate-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  } bg-white dark:bg-slate-950 ${shaking ? "animate-shake" : ""}`}
                >
                  {/* Fixed +91 prefix with Indian Flag */}
                  <div className="flex items-center gap-1.5 pl-3 sm:pl-4 pr-2.5 sm:pr-3 py-2.5 sm:py-3.5 border-r border-slate-200 dark:border-slate-800 select-none flex-shrink-0">
                    <span className="text-base sm:text-lg leading-none" role="img" aria-label="India">
                      🇮🇳
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono">
                      +91
                    </span>
                  </div>

                  {/* Large Input Field */}
                  <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={displayValue}
                    onChange={handleInputChange}
                    placeholder="98765 43210"
                    className="flex-1 min-w-0 px-2.5 sm:px-3.5 py-2.5 sm:py-3.5 bg-transparent text-slate-900 dark:text-white font-mono text-base sm:text-lg font-bold tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none"
                  />

                  {/* Clear button */}
                  {rawDigits.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="p-1 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Clear number"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Validation status pill */}
                  {rawDigits.length > 0 && (
                    <div className="pr-2.5 sm:pr-3.5 flex-shrink-0">
                      {isValid ? (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold font-mono bg-emerald-50 dark:bg-emerald-950/60 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>VALID</span>
                        </div>
                      ) : (
                        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums font-mono">
                          {rawDigits.length}/10
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. MIDDLE ELEMENT: Compact 2-Tier Platform Selector */}
              <div className="space-y-1.5 sm:space-y-2 pt-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Target Platform</span>
                  </span>
                  
                  {/* Current Active Indicator */}
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <BrandLogo slug={currentSelectedObj.slug} className="w-3.5 h-3.5" />
                    <span>{currentSelectedObj?.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  </span>
                </div>

                {/* Top Tier (Pills) + Secondary Tier Dropdown */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Top 5 Pills */}
                  {topServices.map((svc) => {
                    const isSelected = selectedService === svc.slug;
                    const isMeesho = svc.slug === "meesho";

                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setSelectedService(svc.slug)}
                        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 border ${
                          isSelected
                            ? isMeesho
                              ? "border-pink-500 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 ring-2 ring-pink-500/20 shadow-2xs"
                              : "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-2xs"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <BrandLogo slug={svc.slug} className="w-4 h-4" />
                        <span>{svc.name}</span>
                        {isMeesho && (
                          <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-pink-200/80 dark:bg-pink-900/80 text-pink-800 dark:text-pink-200">
                            #1
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Secondary Tier ("More Services" Dropdown) */}
                  <div className="relative inline-block flex-1 sm:flex-initial min-w-[130px]">
                    <select
                      value={isSelectedFromDropdown ? selectedService : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedService(e.target.value);
                        }
                      }}
                      className={`w-full appearance-none pl-2.5 sm:pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer focus:outline-none ${
                        isSelectedFromDropdown
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <option value="">
                        {isSelectedFromDropdown
                          ? `Active: ${currentSelectedObj?.name}`
                          : `+${remainingServices.length} More Apps ▾`}
                      </option>
                      {remainingServices.map((svc) => (
                        <option key={svc.id} value={svc.slug}>
                          {svc.icon ? `${svc.icon} ` : ""}{svc.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Error Helper */}
              {error && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 3. BOTTOM ELEMENT: Primary Action Button */}
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className={`w-full h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed ${
                  cooldown > 0
                    ? "bg-slate-400 dark:bg-slate-700"
                    : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Querying {currentSelectedObj?.name}...</span>
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>Wait {cooldown}s...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Verify Registration on {currentSelectedObj?.name}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Key Pool & Status Strip */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">SuperAssets Live API v1</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              {/* Dynamic Key Pool Badge */}
              <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                <Key className="w-2.5 h-2.5 text-indigo-500" />
                <span>{poolSize} {poolSize === 1 ? "Key" : "Keys"} ({effectiveCooldownSeconds}s)</span>
              </span>

              <span className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>21 Live</span>
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (lg:col-span-5) - Live Result & Activity Ledger */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          
          <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-20">
            
            {/* Live Result Container */}
            {currentResult ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    <span>Live Verification Output</span>
                  </div>
                  <button
                    onClick={() => setCurrentResult(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Dismiss
                  </button>
                </div>
                <ResultCard
                  result={currentResult}
                  onDismiss={() => setCurrentResult(null)}
                />
              </div>
            ) : (
              /* Standby Placeholder Card */
              <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-4 sm:p-5 text-center space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto border border-indigo-200/60 dark:border-indigo-800/60">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Ready for Verification
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mx-auto">
                    Type a 10-digit number and tap Verify to check live registration status.
                  </p>
                </div>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <span>Selected:</span>
                    <BrandLogo slug={currentSelectedObj.slug} className="w-3.5 h-3.5" />
                    <span className="font-bold text-slate-900 dark:text-white">{currentSelectedObj?.name}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Live Verifications Activity Feed */}
            <div className="pt-0.5">
              <HistoryList
                items={history}
                onSelect={handleHistorySelect}
                onClear={() => setHistory([])}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

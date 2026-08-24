import { NextResponse } from "next/server";
import { ServiceItem } from "@/lib/types";
import { keyPool } from "@/lib/keyManager";

// Metadata mapping for all active SuperAssets services
export const SERVICE_METADATA: Record<string, { name: string; icon: string; category: string; color: string }> = {
  meesho: { name: "Meesho", icon: "👗", category: "Shopping", color: "#9b2063" },
  flipkart: { name: "Flipkart", icon: "🛍️", category: "E-Commerce", color: "#2874f0" },
  swiggy: { name: "Swiggy", icon: "🍔", category: "Food Delivery", color: "#fc8019" },
  blinkit: { name: "Blinkit", icon: "⚡", category: "Quick Commerce", color: "#f7ca00" },
  amazon: { name: "Amazon", icon: "📦", category: "E-Commerce", color: "#ff9900" },
  ajio: { name: "Ajio", icon: "✨", category: "Fashion", color: "#2c4152" },
  myntra: { name: "Myntra", icon: "👠", category: "Fashion", color: "#ff3f6c" },
  shein: { name: "Shein", icon: "👗", category: "Fashion", color: "#000000" },
  oyo: { name: "Oyo", icon: "🏨", category: "Hotels", color: "#ee2e24" },
  whatsapp: { name: "WhatsApp", icon: "💬", category: "Messaging", color: "#25d366" },
  telegram: { name: "Telegram", icon: "✈️", category: "Messaging", color: "#0088cc" },
  lenskart: { name: "Lenskart", icon: "👓", category: "Eyewear", color: "#000042" },
  bigbasket: { name: "BigBasket", icon: "🥦", category: "Groceries", color: "#84c225" },
  jio: { name: "MyJio", icon: "📱", category: "Telecom", color: "#0a2885" },
  plutos: { name: "Plutos", icon: "🎮", category: "Gaming", color: "#6366f1" },
  starexch: { name: "Starexch", icon: "⭐", category: "Exchange", color: "#f59e0b" },
  mantrimall: { name: "Mantrimall", icon: "🏪", category: "Shopping", color: "#10b981" },
  crownit: { name: "Crownit", icon: "👑", category: "Rewards", color: "#eab308" },
  habuildyoga: { name: "Habuild / HabitYoga", icon: "🧘", category: "Wellness", color: "#06b6d4" },
  brevistay: { name: "Brevistay", icon: "🛏️", category: "Hotels", color: "#ec4899" },
  gosats: { name: "Gosats", icon: "🪙", category: "Crypto/Rewards", color: "#f97316" },
};

export const FALLBACK_SERVICES: ServiceItem[] = Object.entries(SERVICE_METADATA).map(([slug, meta]) => ({
  id: slug,
  slug,
  name: meta.name,
  icon: meta.icon,
  category: meta.category,
  color: meta.color,
  active: true,
}));

export async function GET() {
  const poolSize = keyPool.getPoolSize();

  if (poolSize === 0) {
    return NextResponse.json({
      success: true,
      services: FALLBACK_SERVICES,
      isFallback: true,
    });
  }

  try {
    const keyData = await keyPool.getAvailableKey();
    const activeKey = keyData?.key;

    if (!activeKey) {
      return NextResponse.json({
        success: true,
        services: FALLBACK_SERVICES,
        isFallback: true,
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://superassets.in/api/v1/services", {
      method: "GET",
      headers: {
        "X-API-Key": activeKey,
        "Accept": "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 120 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({
        success: true,
        services: FALLBACK_SERVICES,
        isFallback: true,
      });
    }

    const data = await res.json();
    let serviceList: string[] = [];

    if (Array.isArray(data.services)) {
      serviceList = data.services;
    } else if (Array.isArray(data)) {
      serviceList = data;
    } else if (Array.isArray(data.data)) {
      serviceList = data.data;
    }

    if (serviceList.length === 0) {
      return NextResponse.json({
        success: true,
        services: FALLBACK_SERVICES,
        isFallback: true,
      });
    }

    const services: ServiceItem[] = serviceList.map((slugOrObj: any) => {
      const slug = (typeof slugOrObj === "string" ? slugOrObj : (slugOrObj.slug || slugOrObj.id || "")).toLowerCase().trim();
      const meta = SERVICE_METADATA[slug] || {
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        icon: "📱",
        category: "Platform",
        color: "#4f46e5",
      };

      return {
        id: slug,
        slug,
        name: meta.name,
        icon: meta.icon,
        category: meta.category,
        color: meta.color,
        active: true,
      };
    });

    return NextResponse.json({
      success: true,
      services,
      isFallback: false,
    });
  } catch {
    return NextResponse.json({
      success: true,
      services: FALLBACK_SERVICES,
      isFallback: true,
    });
  }
}

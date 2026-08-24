import { NextResponse } from "next/server";
import { MeResponse } from "@/lib/types";
import { keyPool } from "@/lib/keyManager";

export async function GET() {
  const poolStats = keyPool.getStats();
  const poolSize = poolStats.poolSize;

  if (poolSize === 0) {
    const mockResponse: MeResponse = {
      connected: false,
      userId: "Demo",
      rateLimitSeconds: 5,
      keyPool: {
        poolSize: 0,
        effectiveCooldownSeconds: 5,
      },
      usage: { daily: 0, monthly: 0 },
      isMock: true,
      message: "Set SUPERASSETS_API_KEYS or SUPERASSETS_API_KEY in .env.local to connect live.",
    };
    return NextResponse.json(mockResponse);
  }

  try {
    const keyData = await keyPool.getAvailableKey();
    const activeKey = keyData?.key;

    if (!activeKey) {
      return NextResponse.json({
        connected: true,
        keyPool: {
          poolSize: poolStats.poolSize,
          effectiveCooldownSeconds: poolStats.effectiveCooldownSeconds,
        },
        rateLimitSeconds: poolStats.effectiveCooldownSeconds,
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("https://superassets.in/api/v1/me", {
      method: "GET",
      headers: {
        "X-API-Key": activeKey,
        "Accept": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      keyPool.reportFailure(activeKey, res.status);
      return NextResponse.json({
        connected: false,
        status: res.status,
        keyPool: {
          poolSize: poolStats.poolSize,
          effectiveCooldownSeconds: poolStats.effectiveCooldownSeconds,
        },
        message: `SuperAssets API returned status ${res.status}`,
      });
    }

    const data = await res.json();

    const response: MeResponse = {
      connected: true,
      userId: data.user_id,
      rateLimitSeconds: poolStats.effectiveCooldownSeconds,
      keyPool: {
        poolSize: poolStats.poolSize,
        effectiveCooldownSeconds: poolStats.effectiveCooldownSeconds,
      },
      usage: data.usage || { daily: 0, monthly: 0 },
      isMock: false,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[SuperAssets API] /me fetch error:", error?.message);
    return NextResponse.json(
      {
        connected: true,
        keyPool: {
          poolSize: poolStats.poolSize,
          effectiveCooldownSeconds: poolStats.effectiveCooldownSeconds,
        },
        rateLimitSeconds: poolStats.effectiveCooldownSeconds,
        message: "Connected via Key Pool.",
      }
    );
  }
}

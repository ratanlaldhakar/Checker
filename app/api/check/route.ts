import { NextRequest, NextResponse } from "next/server";
import { VerificationResult, RegistrationStatus } from "@/lib/types";
import { keyPool } from "@/lib/keyManager";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, number, phoneNumber } = body;
    const targetNumber = (number || phoneNumber || "").trim();

    if (!targetNumber || typeof targetNumber !== "string") {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    const cleanDigits = targetNumber.replace(/\D/g, "");

    // Validate 10-digit Indian mobile number (starts with 6, 7, 8, 9)
    if (cleanDigits.length !== 10 || !/^[6-9]/.test(cleanDigits)) {
      return NextResponse.json(
        { error: "Invalid mobile number. Please enter a 10-digit Indian number starting with 6, 7, 8, or 9." },
        { status: 422 }
      );
    }

    const selectedService = (service || "meesho").toLowerCase().trim();
    const formattedNumber = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;
    const serviceDisplayName = selectedService.charAt(0).toUpperCase() + selectedService.slice(1);

    const poolSize = keyPool.getPoolSize();

    // If key pool has active keys, execute with smart key rotation and auto-failover
    if (poolSize > 0) {
      const maxRetries = Math.min(poolSize, 3);
      let lastErrorMessage = "";

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const keyInfo = await keyPool.getAvailableKey();

        if (!keyInfo) {
          break;
        }

        const { key: activeKey, keyIndex, waitMs } = keyInfo;

        // If even the soonest key needs a wait > 2.5s and we've checked
        if (waitMs > 2500) {
          const waitSeconds = Math.ceil(waitMs / 1000);
          return NextResponse.json(
            {
              error: `Key pool busy. Next key ready in ${waitSeconds}s.`,
              retryAfter: waitSeconds,
            },
            { status: 429 }
          );
        }

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          const upstreamRes = await fetch("https://superassets.in/api/v1/check", {
            method: "POST",
            headers: {
              "X-API-Key": activeKey,
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              service: selectedService,
              number: cleanDigits,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          // If rate-limited (429) or unauthorized (401/403), mark key and try next key in pool
          if (upstreamRes.status === 429 || upstreamRes.status === 401 || upstreamRes.status === 403) {
            keyPool.reportFailure(activeKey, upstreamRes.status);
            console.warn(
              `[KeyPool] Key index #${keyIndex} returned ${upstreamRes.status}. Attempting next available key (${attempt + 1}/${maxRetries})...`
            );
            lastErrorMessage = upstreamRes.status === 429 ? "Rate limit reached on key." : "Key authorization error.";
            continue; // Failover to next key in pool
          }

          if (upstreamRes.status === 422) {
            const errData = await upstreamRes.json().catch(() => ({}));
            return NextResponse.json(
              {
                error: errData.detail || errData.message || errData.error || "Validation error: Ensure the number and service are valid.",
              },
              { status: 422 }
            );
          }

          if (!upstreamRes.ok) {
            const errData = await upstreamRes.json().catch(() => ({}));
            keyPool.reportFailure(activeKey, upstreamRes.status);
            lastErrorMessage = errData.detail || errData.message || `Upstream error (${upstreamRes.status}).`;
            continue;
          }

          const data = await upstreamRes.json();

          // Exact response structure from SuperAssets:
          // { "success": true, "service": "meesho", "number": "7742658593", "is_registered": true, "is_down": false }
          const isDown = Boolean(data.is_down);
          const isRegistered = Boolean(data.is_registered === true || data.registered === true);

          const registrationStatus: RegistrationStatus = isDown
            ? "DOWN"
            : isRegistered
            ? "REGISTERED"
            : "UNREGISTERED";

          const result: VerificationResult = {
            id: `chk_${Date.now()}`,
            phoneNumber: cleanDigits,
            formattedNumber,
            service: selectedService,
            serviceName: serviceDisplayName,
            isValid: true,
            registrationStatus,
            isDown,
            keyIndexUsed: keyIndex,
            checkedAt: new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }),
            rawResponse: data,
            message: isDown
              ? `The ${serviceDisplayName} registration checker is temporarily undergoing maintenance on SuperAssets.`
              : isRegistered
              ? `This phone number is actively linked to an account on ${serviceDisplayName}.`
              : `This phone number is not registered on ${serviceDisplayName}.`,
          };

          return NextResponse.json({
            success: true,
            result,
            isLive: true,
            keyPool: {
              poolSize,
              keyIndexUsed: keyIndex,
            },
          });
        } catch (fetchError: any) {
          console.error(`[KeyPool] Fetch error on key index #${keyIndex}:`, fetchError?.message);
          keyPool.reportFailure(activeKey, 500);
          lastErrorMessage = "Network timeout. Retrying next key...";
        }
      }

      // If all attempts failed
      return NextResponse.json(
        {
          error: lastErrorMessage || "All keys in the pool are busy. Please wait a few seconds and try again.",
          retryAfter: keyPool.getEffectiveCooldownSeconds(),
        },
        { status: 429 }
      );
    }

    // Fallback if no API key is provided
    const lastDigit = parseInt(cleanDigits[cleanDigits.length - 1] || "0", 10);
    const isRegistered = lastDigit % 2 === 0;
    const registrationStatus: RegistrationStatus = isRegistered ? "REGISTERED" : "UNREGISTERED";

    const result: VerificationResult = {
      id: `chk_${Date.now()}`,
      phoneNumber: cleanDigits,
      formattedNumber,
      service: selectedService,
      serviceName: serviceDisplayName,
      isValid: true,
      registrationStatus,
      checkedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      message: isRegistered
        ? `This phone number is actively linked to an account on ${serviceDisplayName}.`
        : `This phone number is not registered on ${serviceDisplayName}.`,
    };

    return NextResponse.json({ success: true, result, isDemo: true });
  } catch (error: any) {
    console.error("[Check Route] Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing check request." },
      { status: 500 }
    );
  }
}

/**
 * Intelligent Server-Side Key Pool Manager for SuperAssets API
 * Supports comma-separated keys, per-key cooldowns, round-robin selection, and auto-failover.
 */

interface ManagedKey {
  key: string;
  lastUsedTimestamp: number;
  blockedUntil: number;
  totalRequests: number;
  failures: number;
}

class KeyPoolManager {
  private keys: ManagedKey[] = [];
  private currentIndex = 0;
  private readonly COOLDOWN_MS = 5000; // 5s per key rate-limit from SuperAssets

  constructor() {
    this.refreshKeys();
  }

  /**
   * Reload keys from environment variables
   */
  public refreshKeys(): void {
    const rawKeys = process.env.SUPERASSETS_API_KEYS || process.env.SUPERASSETS_API_KEY || "";
    
    // Split by comma or newline, trim and deduplicate
    const parsed = rawKeys
      .split(/[,;\n]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0 && k !== "your_api_key_here");

    const uniqueKeys = Array.from(new Set(parsed));

    // Preserve existing timestamps for keys already in pool
    this.keys = uniqueKeys.map((key) => {
      const existing = this.keys.find((k) => k.key === key);
      return (
        existing || {
          key,
          lastUsedTimestamp: 0,
          blockedUntil: 0,
          totalRequests: 0,
          failures: 0,
        }
      );
    });
  }

  /**
   * Get the number of active keys in the pool
   */
  public getPoolSize(): number {
    this.refreshKeys();
    return this.keys.length;
  }

  /**
   * Get dynamic client cooldown in seconds based on key pool size
   * 1 key  -> 5s
   * 2 keys -> 2.5s
   * 3 keys -> 1.7s (2s)
   * 5+ keys -> 1s
   */
  public getEffectiveCooldownSeconds(): number {
    const size = this.getPoolSize();
    if (size <= 0) return 5;
    if (size === 1) return 5;
    if (size === 2) return 3;
    if (size >= 5) return 1;
    return Math.max(1, Math.ceil(this.COOLDOWN_MS / (size * 1000)));
  }

  /**
   * Select the best available key, or wait if the soonest key cooldown is near
   */
  public async getAvailableKey(): Promise<{ key: string; keyIndex: number; waitMs: number } | null> {
    this.refreshKeys();

    if (this.keys.length === 0) {
      return null;
    }

    const now = Date.now();

    // 1. Find all keys that have passed the 5s cooldown
    const readyIndices: number[] = [];
    for (let i = 0; i < this.keys.length; i++) {
      const k = this.keys[i];
      if (now >= k.blockedUntil && now - k.lastUsedTimestamp >= this.COOLDOWN_MS) {
        readyIndices.push(i);
      }
    }

    // If we have ready keys, pick in Round-Robin order starting from currentIndex
    if (readyIndices.length > 0) {
      let chosenIndex = readyIndices.find((idx) => idx >= this.currentIndex);
      if (chosenIndex === undefined) {
        chosenIndex = readyIndices[0];
      }

      this.currentIndex = (chosenIndex + 1) % this.keys.length;
      const keyObj = this.keys[chosenIndex];
      keyObj.lastUsedTimestamp = Date.now();
      keyObj.totalRequests++;

      return {
        key: keyObj.key,
        keyIndex: chosenIndex,
        waitMs: 0,
      };
    }

    // 2. If all keys are currently cooling down, find the one that will be ready soonest
    let minWait = Infinity;
    let soonestIndex = 0;

    for (let i = 0; i < this.keys.length; i++) {
      const k = this.keys[i];
      const waitTime = Math.max(0, this.COOLDOWN_MS - (now - k.lastUsedTimestamp));
      const blockWait = Math.max(0, k.blockedUntil - now);
      const totalWait = Math.max(waitTime, blockWait);

      if (totalWait < minWait) {
        minWait = totalWait;
        soonestIndex = i;
      }
    }

    // If wait time is reasonable (e.g. <= 2500ms), wait asynchronously and proceed
    if (minWait > 0 && minWait <= 2500) {
      await new Promise((resolve) => setTimeout(resolve, minWait + 50));
      const keyObj = this.keys[soonestIndex];
      keyObj.lastUsedTimestamp = Date.now();
      keyObj.totalRequests++;
      this.currentIndex = (soonestIndex + 1) % this.keys.length;

      return {
        key: keyObj.key,
        keyIndex: soonestIndex,
        waitMs: minWait,
      };
    }

    // If wait time is larger, return earliest key with waitMs for 429 response
    return {
      key: this.keys[soonestIndex].key,
      keyIndex: soonestIndex,
      waitMs: minWait,
    };
  }

  /**
   * Mark a key as rate-limited or blocked (e.g. on 429 / 401 / 403)
   */
  public reportFailure(keyString: string, statusCode: number): void {
    const keyObj = this.keys.find((k) => k.key === keyString);
    if (!keyObj) return;

    keyObj.failures++;
    const now = Date.now();
    keyObj.lastUsedTimestamp = now;

    if (statusCode === 429) {
      // 5s cooldown on rate limit
      keyObj.blockedUntil = now + this.COOLDOWN_MS;
      console.warn(`[KeyPool] Key index ${this.keys.indexOf(keyObj)} hit 429. Rotating key.`);
    } else if (statusCode === 401 || statusCode === 403) {
      // Invalid/Expired key: block for 60 seconds
      keyObj.blockedUntil = now + 60000;
      console.error(`[KeyPool] Key index ${this.keys.indexOf(keyObj)} invalid (${statusCode}). Blocked for 60s.`);
    }
  }

  /**
   * Get key stats for debugging and /api/me
   */
  public getStats() {
    return {
      poolSize: this.getPoolSize(),
      effectiveCooldownSeconds: this.getEffectiveCooldownSeconds(),
      keys: this.keys.map((k, idx) => ({
        index: idx,
        masked: `${k.key.slice(0, 6)}...${k.key.slice(-4)}`,
        lastUsedAgoSec: k.lastUsedTimestamp > 0 ? Math.round((Date.now() - k.lastUsedTimestamp) / 1000) : null,
        isCoolingDown: Date.now() - k.lastUsedTimestamp < this.COOLDOWN_MS,
        totalRequests: k.totalRequests,
        failures: k.failures,
      })),
    };
  }
}

// Global Singleton for Next.js server instance
const globalKeyPool = global as unknown as { __superassets_key_pool?: KeyPoolManager };

export const keyPool: KeyPoolManager =
  globalKeyPool.__superassets_key_pool || (globalKeyPool.__superassets_key_pool = new KeyPoolManager());

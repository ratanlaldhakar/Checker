export type RegistrationStatus = "REGISTERED" | "UNREGISTERED" | "DOWN" | "UNKNOWN";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category?: string;
  icon?: string;
  active: boolean;
  color?: string;
}

export interface KeyPoolInfo {
  poolSize: number;
  effectiveCooldownSeconds: number;
  keysSummary?: Array<{
    index: number;
    masked: string;
    isCoolingDown: boolean;
  }>;
}

export interface MeResponse {
  connected: boolean;
  userId?: number | string;
  rateLimitSeconds?: number;
  keyPool?: KeyPoolInfo;
  usage?: {
    daily: number;
    monthly: number;
    services?: Record<string, number>;
  };
  isMock?: boolean;
  message?: string;
}

export interface VerificationResult {
  id: string;
  phoneNumber: string;
  formattedNumber: string;
  service: string;
  serviceName: string;
  isValid: boolean;
  registrationStatus: RegistrationStatus;
  isDown?: boolean;
  checkedAt: string;
  keyIndexUsed?: number;
  message?: string;
  rawResponse?: Record<string, unknown>;
}

export interface VerificationHistoryItem extends VerificationResult {
  timestamp: number;
}

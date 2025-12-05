export interface TensorRentConfig {
  identity: string;
  wallet: string;
  endpoint?: string;
  timeout?: number;
  retries?: number;
}

export interface AcquireOptions {
  type: 'cpu' | 'gpu';
  cores: number;
  vram?: number; // GB of video memory (GPU only)
  tier: 'standard' | 'performance' | 'extreme';
  duration?: number;
}

export interface SessionMetrics {
  coresUsed: number;
  vramUsed?: number; // GB of VRAM used
  timeElapsed: number;
  costAccumulated: number;
  throughput: number;
}

export interface PaymentDetails {
  amount: number;
  token: string;
  txHash: string;
  timestamp: number;
}

export interface IdentityProof {
  publicKey: string;
  signature: string;
  timestamp: number;
  proof: string;
}

export interface CoreAvailability {
  type: 'cpu' | 'gpu';
  available: number;
  total: number;
  tier: string;
}

export interface PricingTier {
  tier: string;
  cpuRate: number;
  gpuRate: number;
  vramRate: number; // per GB per ms
}

export type EventType = 
  | 'session.start'
  | 'session.end'
  | 'payment.pending'
  | 'payment.settled'
  | 'payment.failed'
  | 'error';

export interface TensorRentEvent {
  type: EventType;
  data: any;
  timestamp: number;
}

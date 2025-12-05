import { EventEmitter } from 'events';
import { Session } from './Session';
import { Identity403 } from './Identity403';
import { Payment402 } from './Payment402';
import type {
  TensorRentConfig,
  AcquireOptions,
  CoreAvailability,
  PricingTier,
  EventType,
  TensorRentEvent,
} from './types';

export class TensorRent extends EventEmitter {
  private config: Required<TensorRentConfig>;
  private identity403: Identity403;
  private payment402: Payment402;
  private activeSessions: Map<string, Session>;

  constructor(config: TensorRentConfig) {
    super();
    this.config = {
      identity: config.identity,
      wallet: config.wallet,
      endpoint: config.endpoint || 'https://api.tensorrent.tech',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    };

    this.identity403 = new Identity403(this.config.identity);
    this.payment402 = new Payment402(this.config.wallet);
    this.activeSessions = new Map();
  }

  async acquire(options: AcquireOptions): Promise<Session> {
    // Verify identity
    const identityProof = await this.identity403.generateProof();

    // Create session
    const session = new Session({
      options,
      config: this.config,
      identity: identityProof,
      payment: this.payment402,
    });

    // Initialize session
    await session.initialize();

    this.activeSessions.set(session.id, session);

    // Emit event
    this.emitEvent('session.start', { session });

    return session;
  }

  async getAvailableCores(): Promise<CoreAvailability[]> {
    // Mock implementation
    return [
      { type: 'cpu', available: 8432, total: 12847, tier: 'all' },
      { type: 'gpu', available: 1523, total: 2891, tier: 'all' },
    ];
  }

  async getPricing(): Promise<PricingTier[]> {
    return [
      { tier: 'standard', cpuRate: 0.001, gpuRate: 0.004 },
      { tier: 'performance', cpuRate: 0.003, gpuRate: 0.012 },
      { tier: 'extreme', cpuRate: 0.008, gpuRate: 0.032 },
    ];
  }

  private emitEvent(type: EventType, data: any) {
    const event: TensorRentEvent = {
      type,
      data,
      timestamp: Date.now(),
    };
    this.emit(type, event);
  }

  async close(): Promise<void> {
    const sessions = Array.from(this.activeSessions.values());
    await Promise.all(sessions.map(s => s.release()));
    this.activeSessions.clear();
  }
}

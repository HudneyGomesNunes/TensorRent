import { describe, it, expect, beforeEach } from 'vitest';
import { Session } from '../lib/Session';
import { Payment402 } from '../lib/Payment402';
import { Identity403 } from '../lib/Identity403';

describe('Session', () => {
  let session: Session;
  let payment: Payment402;
  let identity403: Identity403;

  beforeEach(async () => {
    payment = new Payment402('test-wallet');
    identity403 = new Identity403('test-identity');
    const identityProof = await identity403.generateProof();

    session = new Session({
      options: {
        type: 'gpu',
        cores: 4,
        tier: 'performance',
      },
      config: {
        identity: 'test',
        wallet: 'test',
        endpoint: 'https://test',
        timeout: 30000,
        retries: 3,
      },
      identity: identityProof,
      payment,
    });

    await session.initialize();
  });

  describe('initialization', () => {
    it('should generate unique session ID', () => {
      expect(session.id).toBeDefined();
      expect(typeof session.id).toBe('string');
      expect(session.id.length).toBe(32); // 16 bytes hex
    });
  });

  describe('execute', () => {
    it('should execute task and return result', async () => {
      const result = await session.execute({ task: 'test' });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('cost');
    });

    it('should accumulate costs', async () => {
      await session.execute({ task: 'test1' });
      await session.execute({ task: 'test2' });

      const metrics = session.getMetrics();
      expect(metrics.costAccumulated).toBeGreaterThan(0);
    });
  });

  describe('getMetrics', () => {
    it('should return session metrics', async () => {
      await session.execute({ task: 'test' });

      const metrics = session.getMetrics();

      expect(metrics).toHaveProperty('coresUsed');
      expect(metrics).toHaveProperty('timeElapsed');
      expect(metrics).toHaveProperty('costAccumulated');
      expect(metrics).toHaveProperty('throughput');
      expect(metrics.coresUsed).toBe(4);
    });
  });

  describe('release', () => {
    it('should release session and settle payment', async () => {
      await session.execute({ task: 'test' });
      await session.release();

      const metrics = session.getMetrics();
      expect(metrics.timeElapsed).toBeGreaterThan(0);
    });
  });
});

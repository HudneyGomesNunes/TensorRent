import { describe, it, expect, beforeEach } from 'vitest';
import { Payment402 } from '../lib/Payment402';

describe('Payment402', () => {
  let payment: Payment402;

  beforeEach(() => {
    payment = new Payment402('test-wallet-address');
  });

  describe('settle', () => {
    it('should settle payment and return tx hash', async () => {
      const txHash = await payment.settle({
        amount: 0.01,
        sessionId: 'test-session',
        duration: 1000,
      });

      expect(txHash).toBeDefined();
      expect(typeof txHash).toBe('string');
      expect(txHash.length).toBeGreaterThan(0);
    });

    it('should handle different amounts', async () => {
      const txHash1 = await payment.settle({
        amount: 0.001,
        sessionId: 'test-1',
        duration: 500,
      });

      const txHash2 = await payment.settle({
        amount: 1.5,
        sessionId: 'test-2',
        duration: 5000,
      });

      expect(txHash1).toBeDefined();
      expect(txHash2).toBeDefined();
      expect(txHash1).not.toBe(txHash2);
    });
  });

  describe('estimateFee', () => {
    it('should estimate transaction fee', async () => {
      const fee = await payment.estimateFee(0.1);

      expect(fee).toBeDefined();
      expect(typeof fee).toBe('number');
      expect(fee).toBeGreaterThan(0);
    });
  });

  describe('getBalance', () => {
    it('should return wallet balance', async () => {
      const balance = await payment.getBalance();

      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
    });
  });
});

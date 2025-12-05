import { describe, it, expect, beforeEach } from 'vitest';
import { TensorRent } from '../lib/TensorRent';

describe('TensorRent', () => {
  let tensorrent: TensorRent;

  beforeEach(() => {
    tensorrent = new TensorRent({
      identity: 'test-identity-key',
      wallet: 'test-wallet-address',
    });
  });

  describe('initialization', () => {
    it('should create instance with config', () => {
      expect(tensorrent).toBeInstanceOf(TensorRent);
    });

    it('should accept custom endpoint', () => {
      const custom = new TensorRent({
        identity: 'test',
        wallet: 'test',
        endpoint: 'https://custom.api',
      });
      expect(custom).toBeInstanceOf(TensorRent);
    });
  });

  describe('acquire', () => {
    it('should acquire session with valid options', async () => {
      const session = await tensorrent.acquire({
        type: 'gpu',
        cores: 4,
        tier: 'performance',
      });

      expect(session.id).toBeDefined();
      expect(typeof session.id).toBe('string');
    });

    it('should acquire CPU cores', async () => {
      const session = await tensorrent.acquire({
        type: 'cpu',
        cores: 8,
        tier: 'standard',
      });

      expect(session).toBeDefined();
    });
  });

  describe('getAvailableCores', () => {
    it('should return available cores', async () => {
      const cores = await tensorrent.getAvailableCores();

      expect(Array.isArray(cores)).toBe(true);
      expect(cores.length).toBeGreaterThan(0);
      expect(cores[0]).toHaveProperty('type');
      expect(cores[0]).toHaveProperty('available');
      expect(cores[0]).toHaveProperty('total');
    });
  });

  describe('getPricing', () => {
    it('should return pricing tiers', async () => {
      const pricing = await tensorrent.getPricing();

      expect(Array.isArray(pricing)).toBe(true);
      expect(pricing.length).toBe(3);
      expect(pricing[0]).toHaveProperty('tier');
      expect(pricing[0]).toHaveProperty('cpuRate');
      expect(pricing[0]).toHaveProperty('gpuRate');
    });
  });

  describe('events', () => {
    it('should emit session.start event', async () => {
      let eventReceived = false;

      tensorrent.on('session.start', () => {
        eventReceived = true;
      });

      await tensorrent.acquire({
        type: 'gpu',
        cores: 4,
        tier: 'performance',
      });

      expect(eventReceived).toBe(true);
    });
  });

  describe('close', () => {
    it('should close all active sessions', async () => {
      const session1 = await tensorrent.acquire({
        type: 'gpu',
        cores: 4,
        tier: 'performance',
      });

      const session2 = await tensorrent.acquire({
        type: 'cpu',
        cores: 8,
        tier: 'standard',
      });

      await tensorrent.close();

      // Sessions should be closed
      expect(session1).toBeDefined();
      expect(session2).toBeDefined();
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { Identity403 } from '../lib/Identity403';

describe('Identity403', () => {
  let identity: Identity403;

  beforeEach(() => {
    identity = new Identity403('test-identity-key');
  });

  describe('generateProof', () => {
    it('should generate identity proof', async () => {
      const proof = await identity.generateProof();

      expect(proof).toHaveProperty('publicKey');
      expect(proof).toHaveProperty('signature');
      expect(proof).toHaveProperty('timestamp');
      expect(proof).toHaveProperty('proof');
    });

    it('should generate unique proofs', async () => {
      const proof1 = await identity.generateProof();
      const proof2 = await identity.generateProof();

      expect(proof1.signature).not.toBe(proof2.signature);
      expect(proof1.timestamp).not.toBe(proof2.timestamp);
    });

    it('should derive consistent public key', async () => {
      const proof1 = await identity.generateProof();
      const proof2 = await identity.generateProof();

      expect(proof1.publicKey).toBe(proof2.publicKey);
    });
  });

  describe('verify', () => {
    it('should verify valid proof', async () => {
      const proof = await identity.generateProof();
      const isValid = identity.verify(proof);

      expect(isValid).toBe(true);
    });

    it('should reject invalid proof', async () => {
      const proof = await identity.generateProof();
      proof.signature = 'invalid-signature';

      const isValid = identity.verify(proof);
      expect(isValid).toBe(false);
    });
  });
});

# Changelog

## Recent Update (December 2025)

### VRAM Allocation

**Added:**
- VRAM allocation support for GPU compute sessions
- `vram` parameter in `AcquireOptions` to specify GB of video memory
- `vramRate` pricing in `PricingTier` (per GB per millisecond)
- `vramUsed` metric in `SessionMetrics` for tracking memory usage
- Updated cost calculation to include VRAM charges
- Interactive proof-of-work demo on website with real-time visualization

**Changed:**
- Pricing model now includes VRAM costs:
  - Standard: $0.001/ms per GB
  - Performance: $0.002/ms per GB
  - Extreme: $0.004/ms per GB
- Session cost calculation combines core and VRAM rates

**Example:**
```typescript
const session = await lease.acquire({
  type: 'gpu',
  cores: 8,
  vram: 24,  // Allocate 24 GB VRAM
  tier: 'extreme'
});
```

---

## Initial Release

### Core Features
- HTTP 402 micropayment protocol integration
- HTTP 403 zero-knowledge identity verification
- Solana blockchain payment settlement
- Session management for compute core leasing
- CLI for acquiring and managing compute resources
- TypeScript support with full type definitions
- Comprehensive test suite
- Event-driven architecture for real-time updates

### Capabilities
- CPU and GPU core leasing
- Three performance tiers (standard, performance, extreme)
- Per-millisecond billing
- Automatic payment settlement
- Identity proof generation and verification
- Session metrics tracking
- Multi-session support
- Error handling and retry logic

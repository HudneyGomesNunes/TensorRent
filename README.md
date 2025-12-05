<div align="center">
  <img src="https://raw.githubusercontent.com/HudneyGomesNunes/TensorRent/main/assets/logo.png" alt="TensorRent" width="120" />
  
  # TensorRent 402
  
  **Compute Core Leasing Protocol**
  
  Robots rent CPU/GPU cores from a distributed network and pay per millisecond via HTTP 402. Protocol 403 identity ensures permissioned access to high-performance nodes.
  
  [![NPM Version](https://img.shields.io/npm/v/@tensorrent/sdk?style=flat&color=success)](https://www.npmjs.com/package/@tensorrent/sdk)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Tests](https://img.shields.io/badge/tests-passing-success?style=flat)](https://github.com/HudneyGomesNunes/TensorRent)
  
  [Website](https://tensorrent.tech) · [Documentation](https://tensorrent.tech/docs) · [X/Twitter](https://x.com/TensorRent402)
</div>

---

## ⚡ Features

- **Per-millisecond billing** — Pay only for what you use
- **HTTP 402 micropayments** — Instant settlement on Solana blockchain
- **HTTP 403 identity** — Zero-knowledge robot verification
- **Multi-tier performance** — Standard, Performance, Extreme
- **VRAM allocation** — Allocate video memory for GPU workloads (8-48 GB)
- **Real-time metrics** — Track cores, VRAM, cost, and throughput
- **Event-driven architecture** — Subscribe to session and payment events
- **TypeScript native** — Full type definitions included
- **CLI included** — Manage sessions from terminal

## 📦 Installation

```bash
npm install @tensorrent/sdk
```

```bash
yarn add @tensorrent/sdk
```

```bash
pnpm add @tensorrent/sdk
```

## 🚀 Quick Start

```typescript
import { TensorRent } from '@tensorrent/sdk';

// Initialize with robot identity and Solana wallet
const lease = new TensorRent({
  identity: process.env.ROBOT_403_KEY,
  wallet: process.env.SOLANA_WALLET
});

// Acquire 4 GPU cores with 16 GB VRAM
const session = await lease.acquire({
  type: 'gpu',
  cores: 4,
  vram: 16,
  tier: 'performance'
});

// Execute compute task
const result = await session.execute({
  algorithm: 'neural-network',
  data: trainingData
});

// Release cores and settle payment via HTTP 402
await session.release();
```

## 📖 Usage Examples

### Basic Session

```typescript
const lease = new TensorRent({
  identity: 'your-robot-403-key',
  wallet: 'your-solana-wallet'
});

const session = await lease.acquire({
  type: 'gpu',
  cores: 8,
  vram: 24,  // Allocate 24 GB of VRAM
  tier: 'extreme'
});

try {
  const result = await session.execute(myTask);
  console.log('Result:', result);
} finally {
  await session.release();
}
```

### Event Handling

```typescript
lease.on('session.start', (event) => {
  console.log('Session started:', event.data.session.id);
});

lease.on('payment.settled', (event) => {
  console.log('Payment completed:', event.data);
});

lease.on('error', (event) => {
  console.error('Error:', event.data);
});
```

### Check Availability

```typescript
// Get available cores
const cores = await lease.getAvailableCores();
console.log('Available:', cores);

// Get pricing tiers
const pricing = await lease.getPricing();
console.log('Pricing:', pricing);
```

### Session Metrics

```typescript
const session = await lease.acquire({ type: 'gpu', cores: 4, tier: 'performance' });

await session.execute(task);

const metrics = session.getMetrics();
console.log('Cores used:', metrics.coresUsed);
console.log('Time elapsed:', metrics.timeElapsed);
console.log('Cost accumulated:', metrics.costAccumulated);
```

### Error Handling

```typescript
try {
  const session = await lease.acquire({ type: 'gpu', cores: 4, tier: 'performance' });
  await session.execute(task);
  await session.release();
} catch (error) {
  if (error.code === 'INSUFFICIENT_CORES') {
    console.error('Not enough cores available');
  } else if (error.code === 'PAYMENT_FAILED') {
    console.error('Payment settlement failed');
  } else if (error.code === 'IDENTITY_VERIFICATION_FAILED') {
    console.error('403 identity verification failed');
  }
}
```

## 🔧 CLI Usage

```bash
# Acquire compute cores
tensorrent acquire --type gpu --cores 4 --tier performance

# Check status
tensorrent status

# View pricing
tensorrent pricing

# Check available cores
tensorrent cores
```

### CLI Options

```bash
tensorrent acquire [options]

Options:
  --identity <key>    Robot 403 identity key
  --wallet <address>  Solana wallet address
  --type <type>       Core type (cpu|gpu)
  --cores <number>    Number of cores
  --tier <tier>       Performance tier (standard|performance|extreme)
```

### Environment Variables

```bash
export ROBOT_403_KEY="your-robot-identity-key"
export SOLANA_WALLET="your-solana-wallet-address"
```

## 📚 API Reference

### `TensorRent`

Main class for interacting with the TensorRent network.

#### Constructor

```typescript
new TensorRent(config: TensorRentConfig)
```

**Config Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `identity` | `string` | ✅ | HTTP 403 robot identity key |
| `wallet` | `string` | ✅ | Solana wallet address |
| `endpoint` | `string` | ❌ | Custom API endpoint |
| `timeout` | `number` | ❌ | Request timeout (default: 30000) |
| `retries` | `number` | ❌ | Retry attempts (default: 3) |

#### Methods

**`acquire(options: AcquireOptions): Promise<Session>`**

Lease compute cores and create a session.

```typescript
const session = await lease.acquire({
  type: 'gpu',           // 'cpu' | 'gpu'
  cores: 4,              // 1-10000
  tier: 'performance'    // 'standard' | 'performance' | 'extreme'
});
```

**`getAvailableCores(): Promise<CoreAvailability[]>`**

Query available cores in the network.

**`getPricing(): Promise<PricingTier[]>`**

Get current pricing information for all tiers.

**`on(event: EventType, callback: Function): void`**

Subscribe to events: `session.start`, `session.end`, `payment.pending`, `payment.settled`, `payment.failed`, `error`

**`close(): Promise<void>`**

Close all active sessions and settle payments.

### `Session`

Represents an active compute session.

#### Methods

**`execute<T>(task: any): Promise<T>`**

Execute a compute task on leased cores.

**`release(): Promise<void>`**

Release cores and settle payment via HTTP 402.

**`getMetrics(): SessionMetrics`**

Get current session metrics (cores, time, cost, throughput).

**`extendLease(duration: number): Promise<void>`**

Extend the current lease duration.

## 💰 Pricing

| Tier | CPU | GPU | VRAM |
|------|-----|-----|------|
| **Standard** | $0.001/ms | $0.004/ms | $0.001/ms per GB |
| **Performance** | $0.003/ms | $0.012/ms | $0.002/ms per GB |
| **Extreme** | $0.008/ms | $0.032/ms | $0.004/ms per GB |

*All payments settled instantly on Solana via HTTP 402 protocol.*

## 🔐 Protocols

### HTTP 402 — Micropayments

Enables per-millisecond billing with instant settlement on Solana blockchain. Payments are automatically processed when you release a session.

### HTTP 403 — Identity Layer

Provides cryptographic robot identity verification using zero-knowledge proofs. Ensures permissioned access to high-performance compute nodes without exposing sensitive credentials.

## 🧪 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck
```

## 📂 Project Structure

```
TensorRent/
├── lib/                    # TypeScript source
│   ├── TensorRent.ts      # Main class
│   ├── Session.ts         # Session management
│   ├── Identity403.ts     # HTTP 403 identity
│   ├── Payment402.ts      # HTTP 402 payments
│   └── types.ts           # Type definitions
├── spec/                   # Vitest tests
├── bin/                    # CLI executable
├── dist/                   # Build output (CJS + ESM)
└── example.js             # Usage examples
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website:** [tensorrent.tech](https://tensorrent.tech)
- **Documentation:** [tensorrent.tech/docs](https://tensorrent.tech/docs)
- **X/Twitter:** [@TensorRent402](https://x.com/TensorRent402)
- **Email:** [support@tensorrent.tech](mailto:support@tensorrent.tech)

---

<div align="center">
  <sub>Built with ❤️ for distributed compute</sub>
</div>

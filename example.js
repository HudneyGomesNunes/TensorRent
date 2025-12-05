const { TensorRent } = require('./dist/index.js');

async function basicExample() {
  console.log('=== Basic Example ===\n');

  const lease = new TensorRent({
    identity: process.env.ROBOT_403_KEY || 'demo-identity-key',
    wallet: process.env.SOLANA_WALLET || 'demo-wallet-address',
  });

  // Acquire GPU cores
  const session = await lease.acquire({
    type: 'gpu',
    cores: 4,
    tier: 'performance',
  });

  console.log(`Session ID: ${session.id}`);

  // Execute compute task
  const result = await session.execute({
    algorithm: 'neural-network',
    data: 'training-data',
  });

  console.log('Execution result:', result);

  // Get metrics
  const metrics = session.getMetrics();
  console.log('Metrics:', metrics);

  // Release and settle payment
  await session.release();
  console.log('Session released and payment settled\n');
}

async function advancedExample() {
  console.log('=== Advanced Example ===\n');

  const lease = new TensorRent({
    identity: process.env.ROBOT_403_KEY || 'demo-identity-key',
    wallet: process.env.SOLANA_WALLET || 'demo-wallet-address',
    timeout: 60000,
    retries: 5,
  });

  // Listen to events
  lease.on('session.start', (event) => {
    console.log('Session started:', event.data.session.id);
  });

  lease.on('payment.settled', (event) => {
    console.log('Payment settled:', event.data);
  });

  // Check available cores
  const available = await lease.getAvailableCores();
  console.log('Available cores:', available);

  // Get pricing
  const pricing = await lease.getPricing();
  console.log('Pricing tiers:', pricing);

  // Acquire session
  const session = await lease.acquire({
    type: 'gpu',
    cores: 8,
    tier: 'extreme',
  });

  try {
    // Multiple executions
    for (let i = 0; i < 3; i++) {
      const result = await session.execute({
        task: `compute-${i}`,
      });
      console.log(`Task ${i} completed:`, result);
    }
  } finally {
    await session.release();
  }

  await lease.close();
  console.log('Lease closed\n');
}

async function errorHandlingExample() {
  console.log('=== Error Handling Example ===\n');

  const lease = new TensorRent({
    identity: process.env.ROBOT_403_KEY || 'demo-identity-key',
    wallet: process.env.SOLANA_WALLET || 'demo-wallet-address',
  });

  try {
    const session = await lease.acquire({
      type: 'gpu',
      cores: 4,
      tier: 'performance',
    });

    const result = await session.execute({
      task: 'compute-heavy-task',
    });

    console.log('Result:', result);

    await session.release();
  } catch (error) {
    if (error.code === 'INSUFFICIENT_CORES') {
      console.error('Not enough cores available');
    } else if (error.code === 'PAYMENT_FAILED') {
      console.error('Payment settlement failed');
    } else if (error.code === 'IDENTITY_VERIFICATION_FAILED') {
      console.error('Identity verification failed');
    } else {
      console.error('Unexpected error:', error.message);
    }
  }

  console.log('');
}

async function main() {
  try {
    await basicExample();
    await advancedExample();
    await errorHandlingExample();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

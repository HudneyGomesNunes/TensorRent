#!/usr/bin/env node

const { TensorRent } = require('../dist/index.js');

const commands = {
  async acquire(args) {
    const identity = process.env.ROBOT_403_KEY || args.identity;
    const wallet = process.env.SOLANA_WALLET || args.wallet;
    
    if (!identity || !wallet) {
      console.error('Error: ROBOT_403_KEY and SOLANA_WALLET required');
      process.exit(1);
    }

    const lease = new TensorRent({ identity, wallet });
    
    const session = await lease.acquire({
      type: args.type || 'gpu',
      cores: parseInt(args.cores) || 4,
      tier: args.tier || 'performance',
    });

    console.log(`Session acquired: ${session.id}`);
    console.log(`Cores: ${args.cores || 4} ${args.type || 'gpu'}`);
    console.log(`Tier: ${args.tier || 'performance'}`);
  },

  async status() {
    console.log('TensorRent 402 Status');
    console.log('Protocol: HTTP 402 + 403');
    console.log('Network: Solana Mainnet');
    console.log('Status: Online');
  },

  async pricing() {
    const lease = new TensorRent({
      identity: 'mock',
      wallet: 'mock',
    });

    const pricing = await lease.getPricing();
    
    console.log('\nTensorRent Pricing (per millisecond):\n');
    pricing.forEach(tier => {
      console.log(`${tier.tier.toUpperCase()}:`);
      console.log(`  CPU: $${tier.cpuRate}/ms`);
      console.log(`  GPU: $${tier.gpuRate}/ms\n`);
    });
  },

  async cores() {
    const lease = new TensorRent({
      identity: 'mock',
      wallet: 'mock',
    });

    const cores = await lease.getAvailableCores();
    
    console.log('\nAvailable Cores:\n');
    cores.forEach(core => {
      const usage = ((core.total - core.available) / core.total * 100).toFixed(1);
      console.log(`${core.type.toUpperCase()}: ${core.available}/${core.total} (${usage}% used)`);
    });
    console.log('');
  },

  help() {
    console.log(`
TensorRent 402 CLI

Usage:
  tensorrent <command> [options]

Commands:
  acquire      Acquire compute cores
  status       Check protocol status
  pricing      View pricing tiers
  cores        Check available cores
  help         Show this help

Options:
  --identity   Robot 403 identity key
  --wallet     Solana wallet address
  --type       Core type (cpu|gpu)
  --cores      Number of cores
  --tier       Performance tier (standard|performance|extreme)

Environment Variables:
  ROBOT_403_KEY     Robot identity key
  SOLANA_WALLET     Solana wallet address

Examples:
  tensorrent acquire --type gpu --cores 4 --tier performance
  tensorrent pricing
  tensorrent cores
    `);
  },
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const options = {};
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      options[args[i].substring(2)] = args[i + 1];
    }
  }

  if (commands[command]) {
    try {
      await commands[command](options);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    commands.help();
    process.exit(1);
  }
}

main();

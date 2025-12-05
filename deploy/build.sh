#!/bin/bash

set -e

echo "Building TensorRent SDK..."
npm run build

echo "Running tests..."
npm test

echo "Checking types..."
npm run typecheck

echo "Build complete!"
echo "Ready to publish with: npm publish"

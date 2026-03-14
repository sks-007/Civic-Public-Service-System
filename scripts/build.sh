#!/bin/bash
# Build and deployment script for Civic Fix Reporter

set -e

echo "🚀 Building Civic Fix Reporter..."

# Build client (Next.js)
echo "📦 Building client application..."
cd client
npm install
npm run build
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install --production
cd ..

echo "✅ Build complete!"
echo "🎯 Ready for deployment"
echo ""
echo "To start in production:"
echo "  1. Start API server: cd server && npm start"
echo "  2. Start client: cd client && npm start"
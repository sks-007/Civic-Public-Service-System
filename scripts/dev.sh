#!/bin/bash
# Development script for Civic Fix Reporter (Client/Server)

echo "🚀 Starting Civic Fix Reporter in development mode..."

# Kill any existing processes on these ports
echo "🔄 Cleaning up existing processes..."
pkill -f "node.*3000" || true
pkill -f "node.*5000" || true

# Start server in background
echo "🖥️  Starting API server on port 5000..."
cd server
npm install
npm run dev &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start client
echo "🌐 Starting client application on port 3000..."
cd client
npm install
npm run dev &
CLIENT_PID=$!
cd ..

echo "✅ Both applications started!"
echo "🌐 Client: http://localhost:3000"
echo "🖥️  API Server: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both applications"

# Wait for interrupt signal
trap 'kill $SERVER_PID $CLIENT_PID; exit' INT
wait
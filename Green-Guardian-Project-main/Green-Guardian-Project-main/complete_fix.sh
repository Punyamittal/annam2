#!/bin/bash

echo "Completely fixing the Environmental Assistant popup issue..."

# Make sure backend is running
cd /mnt/c/Users/User/Documents/GitHub/GreenGuardian/backend
if ! pgrep -f "uvicorn main:app" > /dev/null; then
  echo "Starting backend server..."
  python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
  sleep 3
fi

# Return to project root
cd /mnt/c/Users/User/Documents/GitHub/GreenGuardian

# Remove ALL old chat components
echo "Removing old components..."
rm -f components/ChatAgent.tsx
rm -f components/SimpleChatAgent.tsx
rm -f components/ChatBotIcon.tsx

# Remove any CopilotKit references from package.json
echo "Updating package.json..."
sed -i 's/"@copilotkit\/react-core": ".*",//' package.json
sed -i 's/"@copilotkit\/react-ui": ".*",//' package.json

# Kill any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "next dev" || true

# Install dependencies
echo "Installing dependencies..."
npm install

# Restart the frontend
echo "Starting frontend with new components..."
npm run dev &

echo "Fix completed! The Environmental Assistant popup has been completely removed."
echo "Now you'll only see a chat icon in the bottom right corner that you can click to open the chat."

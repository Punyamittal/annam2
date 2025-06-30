#!/bin/bash

echo "Fixing Environmental Assistant popup issue..."

# Make sure backend is running
cd /mnt/c/Users/User/Documents/GitHub/GreenGuardian/backend
if ! pgrep -f "uvicorn main:app" > /dev/null; then
  echo "Starting backend server..."
  python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
  sleep 3
fi

# Return to project root
cd /mnt/c/Users/User/Documents/GitHub/GreenGuardian

# Remove any old components that might be causing issues
rm -f components/ChatAgent.tsx
rm -f components/SimpleChatAgent.tsx

# Restart the frontend
echo "Restarting frontend..."
pkill -f "next dev" || true
npm run dev &

echo "Fix completed! The Environmental Assistant popup has been removed."
echo "Now you'll only see a chat icon in the bottom right corner that you can click to open the chat."

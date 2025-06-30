#!/bin/bash

echo "Fixing Environmental Assistant..."

# Make sure backend is running
cd /mnt/c/Users/User/Documents/GitHub/GreenGuardian/backend
if ! pgrep -f "uvicorn main:app" > /dev/null; then
  echo "Starting backend server..."
  python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
  sleep 3
fi

# Return to project root
cd /mnt/c/Users/User/Documents/GitHub/GreenGuardian

# Restart the frontend
echo "Restarting frontend..."
pkill -f "next dev" || true
npm run dev &

echo "Fix completed! The Environmental Assistant should now be working."
echo "If you still encounter issues, try restarting your computer and running ./start.sh"

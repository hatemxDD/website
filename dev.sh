#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Development Environment${NC}"
echo -e "${BLUE}===============================${NC}\n"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if required tools are installed
if ! command_exists npm; then
  echo -e "${RED}Error: npm is not installed. Please install Node.js and npm.${NC}"
  exit 1
fi

# Check if terminal supports multiple tabs/panes
TERMINAL=""
if command_exists gnome-terminal; then
  TERMINAL="gnome-terminal"
elif command_exists xterm; then
  TERMINAL="xterm"
elif command_exists konsole; then
  TERMINAL="konsole"
elif command_exists terminal; then
  TERMINAL="terminal"
fi

# Start backend
echo -e "${GREEN}Starting Backend Server...${NC}"
cd backend || { echo -e "${RED}Error: backend directory not found${NC}"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}Installing backend dependencies...${NC}"
  npm install
fi

# Start backend in a new terminal or in background
if [ -n "$TERMINAL" ]; then
  $TERMINAL -- bash -c "cd $(pwd) && npm run dev; exec bash" &
else
  npm run dev &
  BACKEND_PID=$!
  echo -e "${GREEN}Backend running with PID: $BACKEND_PID${NC}"
fi

# Start frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd ../searchLabFrontend-master || { echo -e "${RED}Error: searchLabFrontend-master directory not found${NC}"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}Installing frontend dependencies...${NC}"
  npm install
fi

# Start frontend in a new terminal or current one
if [ -n "$TERMINAL" ]; then
  $TERMINAL -- bash -c "cd $(pwd) && npm run dev; exec bash" &
else
  npm run dev
fi

echo -e "\n${GREEN}Development Environment Started${NC}"
echo -e "${BLUE}Backend: http://localhost:3000${NC}"
echo -e "${BLUE}Frontend: http://localhost:3002${NC}"
echo -e "\nPress Ctrl+C to stop the servers"

# If we're running in background, wait
if [ -z "$TERMINAL" ] && [ -n "$BACKEND_PID" ]; then
  wait $BACKEND_PID
fi 
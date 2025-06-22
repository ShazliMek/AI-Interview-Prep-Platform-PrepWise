#!/bin/bash

# Script to set up ngrok for exposing localhost to Vapi
# This helps make your local development environment accessible to Vapi's servers

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up ngrok tunnel for Vapi API testing${NC}"
echo "=========================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}Error: ngrok is not installed.${NC}"
    echo "Please install ngrok first:"
    echo "  brew install ngrok    # Using Homebrew"
    echo "  Or download from https://ngrok.com/download"
    exit 1
fi

# Check if Next.js is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}Error: Your Next.js app doesn't seem to be running on localhost:3000${NC}"
    echo "Please start your Next.js app in another terminal window:"
    echo "  npm run dev"
    exit 1
fi

echo -e "${GREEN}Starting ngrok tunnel to localhost:3000...${NC}"
echo "This will create a public URL that Vapi can use to access your local API endpoints."
echo ""
echo -e "${YELLOW}IMPORTANT:${NC} Once ngrok provides a URL, you need to update your Vapi workflow with the new URLs:"
echo "1. Open your Vapi workflow in the dashboard"
echo "2. Update the API URLs to use the ngrok URL instead of localhost"
echo "   - Change http://localhost:3000/api/interview-questions"
echo "   - Change http://localhost:3000/api/save-interview"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the tunnel when done testing.${NC}"
echo ""

# Start ngrok
ngrok http 3000

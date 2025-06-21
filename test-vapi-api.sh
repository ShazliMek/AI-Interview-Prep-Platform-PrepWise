#!/bin/bash

# Test script for Vapi API endpoints
# This script helps verify that your local API endpoints are accessible

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Define the base URL - change if using a different port
BASE_URL="http://localhost:3000"

echo -e "${YELLOW}Testing Vapi API Endpoints${NC}"
echo "============================="
echo ""

# Test the interview-questions endpoint
echo -e "${YELLOW}Testing GET /api/interview-questions${NC}"
RESPONSE=$(curl -s -o response.json -w "%{http_code}" "$BASE_URL/api/interview-questions?company=Example&role=Developer&experience=Mid-level&tech=JavaScript")

if [ "$RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓ Status code: $RESPONSE${NC}"
  echo "Response content:"
  cat response.json | jq '.' 2>/dev/null || cat response.json
else
  echo -e "${RED}✗ Status code: $RESPONSE${NC}"
  echo "Response content:"
  cat response.json | jq '.' 2>/dev/null || cat response.json
fi

echo ""

# Test the save-interview endpoint
echo -e "${YELLOW}Testing POST /api/save-interview${NC}"
RESPONSE=$(curl -s -o response.json -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "interviewData": {
      "company": "Test Company",
      "jobTitle": "Test Developer",
      "experience": "Mid-level",
      "techStack": "JavaScript, React, Node.js",
      "notes": "Test notes",
      "questionsAsked": 5
    },
    "feedback": "Good communication skills, needs improvement on technical depth",
    "timestamp": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'"
  }' \
  "$BASE_URL/api/save-interview")

if [ "$RESPONSE" -eq 200 ]; then
  echo -e "${GREEN}✓ Status code: $RESPONSE${NC}"
  echo "Response content:"
  cat response.json | jq '.' 2>/dev/null || cat response.json
else
  echo -e "${RED}✗ Status code: $RESPONSE${NC}"
  echo "Response content:"
  cat response.json | jq '.' 2>/dev/null || cat response.json
fi

echo ""

# Test CORS headers for interview-questions
echo -e "${YELLOW}Testing CORS Headers for /api/interview-questions${NC}"
RESPONSE=$(curl -s -I -X OPTIONS "$BASE_URL/api/interview-questions" | grep -i "Access-Control-Allow")

if [ -n "$RESPONSE" ]; then
  echo -e "${GREEN}✓ CORS headers present:${NC}"
  echo "$RESPONSE"
else
  echo -e "${RED}✗ No CORS headers detected${NC}"
fi

echo ""

# Test CORS headers for save-interview
echo -e "${YELLOW}Testing CORS Headers for /api/save-interview${NC}"
RESPONSE=$(curl -s -I -X OPTIONS "$BASE_URL/api/save-interview" | grep -i "Access-Control-Allow")

if [ -n "$RESPONSE" ]; then
  echo -e "${GREEN}✓ CORS headers present:${NC}"
  echo "$RESPONSE"
else
  echo -e "${RED}✗ No CORS headers detected${NC}"
fi

echo ""
echo -e "${YELLOW}API Test Complete${NC}"
echo "If testing from Vapi, make sure your local server is accessible from the internet."
echo "Consider using ngrok: 'ngrok http 3000' and update the URLs in your Vapi workflow."

# Clean up
rm response.json 2>/dev/null

exit 0

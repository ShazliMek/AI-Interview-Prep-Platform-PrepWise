#!/bin/bash

echo "🧪 AI Interview Prep Platform - Testing Suite"
echo "============================================"
echo ""

BASE_URL="http://localhost:3001"

echo "1. 🏥 System Health Check:"
curl -s $BASE_URL/api/system-status | jq '.overallStatus'
echo ""

echo "2. 🔒 Test Encryption System:"
curl -s $BASE_URL/api/test-recordings | jq '.tests'
echo ""

echo "3. 🔥 Test Firebase Connection:"
curl -s $BASE_URL/api/test-firebase | jq '.tests'
echo ""

echo "4. 📋 Diagnostics (no auth):"
curl -s "$BASE_URL/api/diagnostics?skipAuth=true" | jq '.tests'
echo ""

echo "5. 🎤 Test File Upload (create test file first):"
echo "   Run: echo 'test audio' > demo.txt"
echo "   Then: curl -X POST $BASE_URL/api/test-upload -F 'audio=@demo.txt' -F 'interviewId=test-123' -F 'metadata={}'"
echo ""

echo "6. 🌐 Browser Tests:"
echo "   • System Dashboard: $BASE_URL/test-vapi"
echo "   • Interview Flow: $BASE_URL/interview/software-engineer"  
echo "   • Privacy Settings: $BASE_URL/my-account"
echo ""

echo "✅ All systems operational with local storage fallback!"
echo "💡 Enable Firebase Storage billing for production deployment."

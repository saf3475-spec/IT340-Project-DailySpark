#!/usr/bin/env bash
# API tests: run from the FE VM
BASE="http://192.168.56.11:3000"

post() {
  curl -s -w '  [HTTP %{http_code}]\n' -X POST "$BASE$1" \
    -H 'Content-Type: application/json' -d "$2"
}

echo "1) health";                         curl -s -w '  [HTTP %{http_code}]\n' "$BASE/api/health"
echo "2) register (expect 201)";          post /api/register '{"username":"testuser","email":"test@example.com","password":"correct-horse-battery"}'
echo "3) register again (expect 409)";    post /api/register '{"username":"testuser","email":"test@example.com","password":"correct-horse-battery"}'
echo "4) login ok (expect 200)";          post /api/login '{"username":"testuser","password":"correct-horse-battery"}'
echo "5) wrong password (expect 401)";    post /api/login '{"username":"testuser","password":"wrong-password-here"}'
echo "6) short password (expect 400)";    post /api/register '{"username":"shorty","email":"s@example.com","password":"short"}'
echo "7) SQL injection (expect 401)";     post /api/login "{\"username\":\"' OR '1'='1\",\"password\":\"x\"}"
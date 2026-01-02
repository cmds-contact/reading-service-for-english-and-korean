#!/bin/bash

# 스크립트가 있는 디렉토리로 이동
cd "$(dirname "$0")"

echo "========================================="
echo "  Reading Service - Development Server"
echo "========================================="
echo ""

# node_modules 확인
if [ ! -d "node_modules" ]; then
    echo "node_modules가 없습니다. 패키지를 설치합니다..."
    npm install
    echo ""
fi

echo "개발 서버를 시작합니다..."
echo "브라우저에서 http://localhost:3000 으로 접속하세요."
echo "종료하려면 Ctrl+C를 누르세요."
echo ""

npm run dev

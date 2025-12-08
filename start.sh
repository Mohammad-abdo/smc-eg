#!/bin/bash
# Quick Start Script for Backend Server (Linux/Mac)

echo ""
echo "========================================"
echo "  Starting SMC Backend Server"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[WARNING] .env file not found!"
    echo "Creating .env from template..."
    if [ -f env.template ]; then
        cp env.template .env
        echo ""
        echo "[IMPORTANT] Please edit .env file with your database credentials!"
        echo "Press Enter to continue after editing .env..."
        read
    else
        echo "[ERROR] env.template not found!"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting server on port 3001..."
echo ""
echo "========================================"
echo "  Server will start in a moment..."
echo "  Keep this terminal open!"
echo "========================================"
echo ""

npm run dev


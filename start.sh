#!/bin/bash

echo "Starting backend-cms..."
cd backend-cms
docker compose up -d

echo "Starting front..."
cd ../front
docker compose up -d

echo "All services started!"
echo "  - Backend: http://localhost:3000"
echo "  - Front: http://localhost:3001"
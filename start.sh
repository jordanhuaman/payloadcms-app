#!/bin/bash

echo "Starting backend-cms..."
cd backend-cms
docker-compose up -d --build

echo "Starting front..."
cd ../front
docker-compose up -d --build

echo "All services started!"
echo "  - Backend: http://localhost:3000"
echo "  - Front: http://localhost:3001"
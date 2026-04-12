#!/bin/bash

echo "Stopping front..."
cd front
docker compose down

echo "Stopping backend-cms..."
cd ../backend-cms
docker compose down

echo "All services stopped!"
#!/bin/bash
# Deployment Script für Hostinger VPS
# Nutzung: ./deploy.sh

set -e

echo "=== Lebenskunst Online - Deployment ==="

# Pull latest code
echo "-> Code aktualisieren..."
git pull origin master

# Build and restart containers
echo "-> Container bauen und starten..."
docker compose up -d --build

echo "-> Warte auf Start..."
sleep 5

# Check status
docker compose ps

echo ""
echo "=== Deployment abgeschlossen! ==="
echo "App läuft auf Port 3000"
echo "Nginx auf Port 80/443"

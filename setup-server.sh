#!/bin/bash
# Erstmalige Server-Einrichtung für Hostinger VPS (Ubuntu)
# Nutzung: ssh root@deine-vps-ip < setup-server.sh

set -e

echo "=== Hostinger VPS Setup für Lebenskunst ==="

# System aktualisieren
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Docker Compose (ist bei neuen Docker-Versionen dabei)
docker compose version

# Git installieren
apt install -y git

# Firewall einrichten
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Projekt klonen
cd /opt
git clone https://github.com/robintymi/lebenskunst-online.git
cd lebenskunst-online

# .env Datei erstellen
echo "-> Erstelle .env Datei..."
cat > .env << 'ENVEOF'
MONGODB_URI=mongodb://mongo:27017/lebenskunst
PAYLOAD_SECRET=HIER-SICHERES-PASSWORT-EINSETZEN
STRIPE_SECRET_KEY=sk_live_DEIN-STRIPE-KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_DEIN-STRIPE-KEY
NEXT_PUBLIC_SERVER_URL=https://lebenskunstonline.de
ENVEOF

echo ""
echo "=== Setup abgeschlossen! ==="
echo ""
echo "Nächste Schritte:"
echo "1. nano /opt/lebenskunst-online/.env  (Keys eintragen)"
echo "2. SSL Zertifikat holen (siehe unten)"
echo "3. docker compose up -d --build"
echo ""
echo "SSL Zertifikat (Let's Encrypt):"
echo "  # Erstmal ohne SSL starten für Zertifikat:"
echo "  # Nginx config temporär auf HTTP-only ändern, dann:"
echo "  docker run --rm -v certbot_data:/etc/letsencrypt -v certbot_www:/var/www/certbot certbot/certbot certonly --webroot -w /var/www/certbot -d lebenskunstonline.de -d www.lebenskunstonline.de"

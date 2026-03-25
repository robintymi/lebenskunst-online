#!/bin/bash
# MongoDB Backup Script – Lebenskunst Online
# Empfehlung: täglich via Cron ausführen
# Crontab-Eintrag: 0 3 * * * /path/to/backup.sh >> /var/log/lebenskunst-backup.log 2>&1

set -e

BACKUP_DIR="/var/backups/lebenskunst"
CONTAINER="lebenskunst-mongo"
DATE=$(date +%Y-%m-%d_%H-%M)
KEEP_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starte Backup..."

# MongoDB Dump aus Docker-Container
docker exec "$CONTAINER" mongodump \
  --db lebenskunst \
  --out "/tmp/backup-$DATE" \
  --quiet

# Aus Container kopieren
docker cp "$CONTAINER:/tmp/backup-$DATE" "$BACKUP_DIR/backup-$DATE"

# Tar komprimieren
tar -czf "$BACKUP_DIR/backup-$DATE.tar.gz" -C "$BACKUP_DIR" "backup-$DATE"
rm -rf "$BACKUP_DIR/backup-$DATE"

# Cleanup im Container
docker exec "$CONTAINER" rm -rf "/tmp/backup-$DATE"

# Alte Backups löschen
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "[$(date)] Backup abgeschlossen: $BACKUP_DIR/backup-$DATE.tar.gz"
echo "[$(date)] Verbleibende Backups:"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "  (keine)"

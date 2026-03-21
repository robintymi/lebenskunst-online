#!/bin/bash
# MongoDB & Media Backup Script for Lebenskunst Online
# Run via cron: 0 3 * * * /opt/lebenskunst/backup.sh

set -e

BACKUP_DIR="/backups/lebenskunst"
DATE=$(date +%Y-%m-%d_%H%M)
RETENTION_DAILY=7
RETENTION_WEEKLY=4
RETENTION_MONTHLY=3

mkdir -p "$BACKUP_DIR/daily" "$BACKUP_DIR/weekly" "$BACKUP_DIR/monthly"

echo "[$(date)] Starting backup..."

# MongoDB dump
echo "[$(date)] Dumping MongoDB..."
docker exec lebenskunst-mongo mongodump \
  --db lebenskunst \
  --archive="/tmp/mongo-backup-$DATE.gz" \
  --gzip

docker cp "lebenskunst-mongo:/tmp/mongo-backup-$DATE.gz" "$BACKUP_DIR/daily/mongo-$DATE.gz"
docker exec lebenskunst-mongo rm "/tmp/mongo-backup-$DATE.gz"

# Media files backup
echo "[$(date)] Backing up media files..."
tar -czf "$BACKUP_DIR/daily/media-$DATE.tar.gz" \
  -C /opt/lebenskunst/media . 2>/dev/null || true

# Content files backup
echo "[$(date)] Backing up content files..."
tar -czf "$BACKUP_DIR/daily/content-$DATE.tar.gz" \
  -C /opt/lebenskunst/content . 2>/dev/null || true

# Weekly backup (on Sundays)
if [ "$(date +%u)" = "7" ]; then
  echo "[$(date)] Creating weekly backup..."
  cp "$BACKUP_DIR/daily/mongo-$DATE.gz" "$BACKUP_DIR/weekly/mongo-$DATE.gz"
  cp "$BACKUP_DIR/daily/media-$DATE.tar.gz" "$BACKUP_DIR/weekly/media-$DATE.tar.gz"
  cp "$BACKUP_DIR/daily/content-$DATE.tar.gz" "$BACKUP_DIR/weekly/content-$DATE.tar.gz"
fi

# Monthly backup (on 1st of month)
if [ "$(date +%d)" = "01" ]; then
  echo "[$(date)] Creating monthly backup..."
  cp "$BACKUP_DIR/daily/mongo-$DATE.gz" "$BACKUP_DIR/monthly/mongo-$DATE.gz"
  cp "$BACKUP_DIR/daily/media-$DATE.tar.gz" "$BACKUP_DIR/monthly/media-$DATE.tar.gz"
  cp "$BACKUP_DIR/daily/content-$DATE.tar.gz" "$BACKUP_DIR/monthly/content-$DATE.tar.gz"
fi

# Cleanup old backups
echo "[$(date)] Cleaning up old backups..."
find "$BACKUP_DIR/daily" -type f -mtime +$RETENTION_DAILY -delete
find "$BACKUP_DIR/weekly" -type f -mtime +$((RETENTION_WEEKLY * 7)) -delete
find "$BACKUP_DIR/monthly" -type f -mtime +$((RETENTION_MONTHLY * 30)) -delete

echo "[$(date)] Backup complete!"
echo "  MongoDB: $BACKUP_DIR/daily/mongo-$DATE.gz"
echo "  Media:   $BACKUP_DIR/daily/media-$DATE.tar.gz"
echo "  Content: $BACKUP_DIR/daily/content-$DATE.tar.gz"

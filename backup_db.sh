#!/bin/bash
DB_NAME="myappdb"
DB_USER="adminuser"
DB_HOST="172.31.76.165"
DB_PORT="5432"
BACKUP_DIR="/home/ubuntu/backend/db_backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

PGPASSWORD="SuperPassword123" pg_dump -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME > $BACKUP_FILE

gzip $BACKUP_FILE

ls -1tr $BACKUP_DIR/*.gz | head -n -7 | xargs -d '\n' rm -f

echo "Backup realizado: $BACKUP_FILE.gz"

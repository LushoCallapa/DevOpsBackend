#!/bin/bash

DB_NAME="myappdb"
DB_USER="adminuser"
DB_HOST="172.31.76.165"
DB_PORT="5432"
BACKUP_DIR="/home/ubuntu/backend/db_backups"

if [ -z "$1" ]; then
  echo "Uso: $0 <archivo_backup.gz>"
  exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Archivo de backup no encontrado: $BACKUP_FILE"
  exit 1
fi


TEMP_SQL="${BACKUP_FILE%.gz}"

gunzip -c "$BACKUP_FILE" > "$TEMP_SQL"

echo "Restaurando base de datos $DB_NAME desde $TEMP_SQL..."
PGPASSWORD="SuperPassword123" psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f "$TEMP_SQL"

rm -f "$TEMP_SQL"

echo "Restauración completada desde $BACKUP_FILE"

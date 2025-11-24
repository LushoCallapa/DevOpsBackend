# Proyecto - Primer Parcial - DevOps Backend

### Integrantes
- Jhonatan Cabezas - 70416
- Luis Callapa - 68881
- Ernesto Juarez - 68763
- Diego Ledezma - 68779
- Adrian Sánchez - 69546

Breve repositorio backend con Express + TypeScript y Prisma (Postgres). Provee una API para usuarios (registro/login/gestión básica) usando el modelo `User` definido en `prisma/schema.prisma` (campos: `id`, `email`, `password`, `createdAt`). La conexión a la base de datos se toma desde la variable de entorno `DATABASE_URL`.

- **Rutas principales:**
	- `POST /api/users` (registro / creación) — definidas en `src/routes/userRoutes.ts`
	- Rutas relacionadas con usuarios gestionadas en `src/controllers/userController.ts`

- **Persistencia:**
	- ORM: `Prisma` con `prisma/schema.prisma`.
	- `DATABASE_URL` controla host/puerto/usuario/contraseña/base de datos. Ejemplo de formato:
		`postgres://usuario:password@host:5432/nombre_basedatos`
	- El cliente Prisma se inicializa en `src/db.ts`.

- **Autenticación y secretos:**
	- `JWT_SECRET` se espera en el `.env` para firmar tokens (la CI crea este `.env` en EC2).
	- Token/flujo de autenticación gestionado por el backend (guardar token en frontend con `localStorage` es responsabilidad del cliente).

**Workflow de despliegue**
- El workflow en `.github/workflows/cicd.yml` se dispara al hacer `push` a `master`.
- Pasos clave:
	- `checkout` del repo en el runner.
	- Conexión por SSH al servidor EC2 y creación del directorio destino.
	- Copia de todos los archivos al EC2 mediante `scp`.
	- Creación de un archivo `.env` en el EC2 usando secretos (`ENV_DATABASE_URL`, `ENV_JWT_SECRET`, `ENV_PORT`) — ahí es donde se inyecta la `DATABASE_URL`.
	- Instalación de dependencias, build (`npm run build`) y reinicio con `pm2` del servicio (`pm2 start dist/src/server.js --name backend`).

- **Secrets usados en CI:** `EC2_HOST`, `EC2_USER`, `EC2_KEY`, `ENV_DATABASE_URL`, `ENV_JWT_SECRET`, `ENV_PORT`.

**Backups y logs**
- Script de backup: `backup_db.sh` — contiene variables usadas para el `pg_dump`:
	- `DB_NAME="myappdb"`, `DB_USER="adminuser"`, `DB_HOST="172.31.76.165"`, `DB_PORT="5432"`, y usa `PGPASSWORD="SuperPassword123"` en el script para autenticarse (recomendación: mover credenciales a secretos o variables de entorno seguras).
	- Los backups se guardan en `/home/ubuntu/backend/db_backups` según el script y luego se comprimen; existe `db_backups/restore_backup.sh` para restaurar.
- Logs: el proyecto escribe logs en la carpeta `logs/` (ej.: `logs/backend.log`). Si ves mensajes como "Environment variable not found: DATABASE_URL", indica que falta la variable en el entorno.

### Aclaración
El proyecto como tal se ejecuta a traves de ec2s ya configurados en AWS, no es necesario correrlo localmente, y por consecuencia no se necesita la instalación de dependencias ni un .env.
El link al cual conectarse es: http://44.222.122.48:3000/api/users/



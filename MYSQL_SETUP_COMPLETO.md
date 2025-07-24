# 🗄️ Configuración Completa de MySQL para Club Salvadoreño

## 📋 Resumen

Este documento te guiará paso a paso para configurar MySQL y conectar tu aplicación a una base de datos real en lugar de usar mocks.

## 🎯 Archivos Creados

1. **`setup-mysql-database.sql`** - Script completo de inicialización de la base de datos
2. **`setup-database.js`** - Script Node.js para ejecutar la configuración automáticamente
3. **`test-mysql-connection.js`** - Script para verificar la conexión a MySQL
4. **Actualizaciones en el código** - Deshabilitación de mocks y habilitación de MySQL real

## 🚀 Pasos de Configuración

### 1. Verificar MySQL

Primero, verifica que MySQL esté instalado y ejecutándose:

```bash
# Verificar estado de MySQL
sudo service mysql status

# Si no está ejecutándose, iniciarlo
sudo service mysql start

# Verificar conexión
node test-mysql-connection.js
```

### 2. Configurar la Base de Datos

Ejecuta el script de configuración completa que incluye todos los datos reales:

```bash
# Instalar dependencias si no están instaladas
npm install mysql2 bcryptjs

# Ejecutar configuración COMPLETA con datos reales
node setup-complete-database.js

# O ejecutar paso a paso (alternativo)
node setup-database.js
mysql -u root -p club_salvadoreno_db < real-accommodations-data.sql
```

### 3. Variables de Entorno

Las siguientes variables ya están configuradas en tu `.env`:

```env
# Base de datos MySQL
DATABASE_URL=mysql://root:@localhost:3306/club_salvadoreno_db
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=club_salvadoreno_db
DB_USER=root

# Forzar uso de API real
FORCE_REAL_API=true
```

### 4. Reiniciar el Servidor

```bash
npm run dev:full
```

## 📊 Datos Iniciales Creados

### 👥 Usuarios de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|--------|------------|-----|
| admin | admin@clubsalvadoreno.com | admin123 | super_admin |
| ghernandez | ghernandez@clubsalvadoreno.com | admin123 | atencion_miembro |
| mgarcia | mgarcia@clubsalvadoreno.com | admin123 | anfitrion |
| crodriguez | crodriguez@clubsalvadoreno.com | admin123 | miembro |

### 🏠 Alojamientos Reales (34 propiedades)

**CORINTO (6 Casas):**
- Casa Corinto Marina - $180/noche (8 personas)
- Casa Corinto Pacífico - $220/noche (10 personas)
- Casa Corinto Familiar - $150/noche (6 personas)
- Casa Corinto Deluxe - $300/noche (12 personas)
- Casa Corinto Brisa - $120/noche (4 personas)
- Casa Corinto Sunset - $160/noche (6 personas)

**EL SUNZAL (28 propiedades):**
- 16 Suites: $160-$280/noche (2-6 personas)
- 6 Casas: $320-$500/noche (8-16 personas)
- 6 Apartamentos: $100-$220/noche (2-6 personas)

## 🗃️ Estructura de Base de Datos

### Tablas Principales

1. **users** - Usuarios y autenticación
2. **auth_tokens** - Tokens de autenticación
3. **password_reset_tokens** - Tokens de reseteo de contraseña
4. **registration_requests** - Solicitudes de registro pendientes
5. **accommodations** - Alojamientos disponibles
6. **reservations** - Reservas de usuarios
7. **notifications** - Sistema de notificaciones
8. **activity_logs** - Logs de actividad del sistema
9. **reviews** - Reseñas y calificaciones
10. **messages** - Sistema de mensajería
11. **conversations** - Conversaciones de chat
12. **system_config** - Configuración del sistema

### Índices Optimizados

Cada tabla incluye índices optimizados para:
- Búsquedas por email/username
- Filtros por fecha
- Consultas por estado/tipo
- Claves foráneas

## 🔧 Funcionalidades Habilitadas

### ✅ Operaciones Reales Disponibles

- ✅ Autenticación y autorización real
- ✅ Registro y login de usuarios
- ✅ Gestión de reservas
- ✅ Sistema de notificaciones
- ✅ Logs de actividad
- ✅ Administración de alojamientos
- ✅ Sistema de reseñas
- ✅ Mensajería interna

### 📧 Email y SMS

- ✅ Base de datos: **REAL** (MySQL)
- ⚠️ Email: **MOCK** (hasta configurar credenciales reales)
- ⚠️ SMS: **MOCK** (hasta configurar Twilio)

Para habilitar email real, actualizar en `.env`:
```env
EMAIL_PASSWORD=tu_contraseña_real_aqui
```

## 🛠️ Scripts de Mantenimiento

### Verificar Conexión
```bash
node test-mysql-connection.js
```

### Resetear Base de Datos
```bash
# Eliminar y recrear la base de datos
mysql -u root -p -e "DROP DATABASE IF EXISTS club_salvadoreno_db;"
node setup-database.js
```

### Backup de Base de Datos
```bash
mysqldump -u root -p club_salvadoreno_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar Backup
```bash
mysql -u root -p club_salvadoreno_db < backup_file.sql
```

## 🔍 Verificación de Funcionamiento

### 1. Verificar Conexión a BD
```bash
node test-mysql-connection.js
```

### 2. Probar Login
- Ir a `/login`
- Usuario: `admin`
- Contraseña: `admin123`

### 3. Verificar Datos
- Ir a `/admin/users` para ver usuarios
- Ir a `/admin/accommodations` para ver alojamientos

### 4. Probar Reservas
- Hacer una reserva como usuario normal
- Verificar que se guarde en la base de datos

## 🚨 Solución de Problemas

### Error: "Error al inicializar el servidor"
```bash
# Verificar que MySQL esté ejecutándose
sudo service mysql start

# Verificar credenciales en .env
# Asegurar que DATABASE_URL sea correcto
```

### Error: "Can't connect to MySQL server"
```bash
# Verificar puerto y host
netstat -tlnp | grep :3306

# Verificar usuario y permisos
mysql -u root -p
```

### Tablas no se crean
```bash
# Ejecutar manualmente el script SQL
mysql -u root -p < setup-mysql-database.sql
```

## 📈 Monitoreo

### Ver Logs de Aplicación
```bash
# Logs del servidor backend
npm run server:dev

# Logs detallados en desarrollo
tail -f logs/app.log
```

### Consultas Útiles de MySQL
```sql
-- Ver todas las tablas
SHOW TABLES;

-- Contar usuarios
SELECT COUNT(*) FROM users;

-- Ver últimas reservas
SELECT * FROM reservations ORDER BY created_at DESC LIMIT 10;

-- Ver logs de actividad recientes
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 20;
```

## 🎉 ¡Listo!

Tu aplicación ahora está conectada a MySQL real. Todas las operaciones de base de datos usarán MySQL en lugar de mocks, proporcionando:

- ✅ Persistencia real de datos
- ✅ Mejor rendimiento
- ✅ Funcionalidades completas
- ✅ Preparación para producción

Para cualquier problema, revisar los logs del servidor y usar los scripts de verificación incluidos.

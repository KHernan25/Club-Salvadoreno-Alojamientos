# Configuración de MySQL y Email Real

## 🗄️ Configuración de MySQL

El sistema está preparado para usar MySQL como base de datos principal. Para configurarlo:

### 1. Instalar MySQL
```bash
# En Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# En CentOS/RHEL
sudo yum install mysql-server

# En macOS
brew install mysql
```

### 2. Configurar MySQL
```bash
# Iniciar el servicio
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar seguridad inicial
sudo mysql_secure_installation
```

### 3. Crear la base de datos
```sql
-- Conectarse a MySQL como root
mysql -u root -p

-- Crear la base de datos
CREATE DATABASE club_salvadoreno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional)
CREATE USER 'club_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON club_salvadoreno_db.* TO 'club_user'@'localhost';
FLUSH PRIVILEGES;

-- Salir
exit;
```

### 4. Configurar Variables de Entorno
En tu archivo `.env` o usando el DevServerControl:

```bash
# Variables de entorno para MySQL
DB_TYPE=mysql
DATABASE_URL=mysql://root:password@localhost:3306/club_salvadoreno_db
DB_HOST=localhost
DB_PORT=3306
DB_NAME=club_salvadoreno_db
DB_USER=root
DB_PASSWORD=tu_password_mysql
```

### 5. Verificar la Conexión
```bash
# Probar conexión
mysql -u root -p -h localhost -P 3306 club_salvadoreno_db
```

## 📧 Configuración de Email Real

Para enviar correos reales en lugar de mocks:

### 1. Configurar Variables de Email
```bash
EMAIL_HOST=smtp.gmail.com  # o tu servidor SMTP
EMAIL_PORT=587             # 465 para SSL, 587 para TLS
EMAIL_USER=tu_email@dominio.com
EMAIL_PASSWORD=tu_password_real_aqui
EMAIL_FROM=Club Salvadoreño <tu_email@dominio.com>
```

### 2. Gmail (recomendado para pruebas)
Si usas Gmail:

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Habilita "2-Step Verification"
3. Genera una "App Password" específica para esta aplicación
4. Usa la App Password como `EMAIL_PASSWORD`

### 3. Otros Proveedores SMTP

#### SendGrid
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=tu_sendgrid_api_key
```

#### Mailgun
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=tu_usuario_mailgun
EMAIL_PASSWORD=tu_password_mailgun
```

#### Office 365
```bash
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=tu_email@empresa.com
EMAIL_PASSWORD=tu_password
```

### 4. Verificar Configuración
El sistema verificará automáticamente la configuración al iniciar. Busca en los logs:

```
✅ Email service configured successfully
✅ Email server is ready to take messages
```

## 🔧 Usando DevServerControl (Recomendado)

Para configurar variables de entorno de forma segura:

```javascript
// Configurar MySQL
DevServerControl.set_env_variable(["DB_TYPE", "mysql"]);
DevServerControl.set_env_variable(["DATABASE_URL", "mysql://user:password@localhost:3306/club_salvadoreno_db"]);

// Configurar Email
DevServerControl.set_env_variable(["EMAIL_PASSWORD", "tu_password_real"]);
DevServerControl.set_env_variable(["EMAIL_USER", "tu_email@dominio.com"]);
```

## 🚀 Inicialización Automática

Una vez configurado correctamente:

1. El sistema detectará automáticamente que está usando MySQL
2. Ejecutará el schema `schema-mysql.sql` en lugar del de SQLite
3. Los correos se enviarán realmente en lugar de aparecer solo en consola

## ⚠️ Notas Importantes

- **Seguridad**: Nunca commits passwords reales en git
- **Testing**: Usa cuentas de correo de prueba para desarrollo
- **Producción**: Configura variables de entorno en tu servidor/hosting
- **Backup**: Haz backup de la base de datos MySQL regularmente

## 🔍 Troubleshooting

### Error de Conexión MySQL
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solución**: Verificar que MySQL esté corriendo: `sudo systemctl status mysql`

### Error de Autenticación Email
```
❌ Email service verification failed
```
**Solución**: Verificar credenciales y configuración del proveedor SMTP

### Error de Schema
```
❌ Database schema initialization failed
```
**Solución**: Verificar que el usuario tenga permisos para crear tablas

## 📝 Scripts de Utilidad

Incluidos en el proyecto:

- `test-db-connection.js` - Probar conexión a base de datos
- `test-email.ts` - Probar envío de correos
- `add-user.js` - Agregar usuarios de prueba

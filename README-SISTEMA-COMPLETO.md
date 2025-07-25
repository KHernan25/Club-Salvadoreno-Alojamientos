# 🏨 Club Salvadoreño - Sistema Completo de Alojamientos

## 📖 Descripción

Sistema completo de gestión de alojamientos para el Club Salvadoreño con **precios diferenciados por temporada**, gestión de reservas, control de acceso, facturación de acompañantes y sistema administrativo completo.

### ✨ Características Principales

- 🎯 **Sistema de Precios por Temporada**
  - **Temporada Baja**: Lunes a Jueves (precios base)
  - **Temporada Alta**: Viernes a Domingo (precios elevados)
  - **Días de Asueto**: Feriados oficiales (precios premium)

- 🏠 **Gestión de Alojamientos**
  - El Sunzal: Apartamentos, Casas, Suites
  - Corinto: Apartamentos, Casas con vista al lago
  - 20+ alojamientos configurados con precios reales

- 📅 **Sistema de Reservas Inteligente**
  - Cálculo automático por tipo de día
  - Verificación de disponibilidad
  - Historial detallado de precios

- 👥 **Gestión de Usuarios Multinivel**
  - Super Admin, Atención al Miembro, Anfitrión
  - Monitor, Mercadeo, Recepción, Portería, Miembro

- 🎄 **Calendario de Feriados**
  - Días feriados de El Salvador 2025-2026
  - Gestión automática de precios especiales

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js >= 18.0.0
- MySQL >= 8.0 (recomendado) o SQLite (desarrollo)
- npm >= 8.0.0

### 1. Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/club-salvadoreno/sistema-alojamientos
cd sistema-alojamientos

# Instalar dependencias (ejecuta automáticamente la configuración)
npm install

# El script postinstall ejecutará automáticamente la configuración inicial
```

### 2. Configuración de Base de Datos

#### Opción A: MySQL (Recomendado para producción)

```bash
# 1. Instalar MySQL y crear base de datos
mysql -u root -p
CREATE DATABASE club_salvadoreno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# 2. Configurar .env
DATABASE_URL=mysql://root:@localhost:3306/club_salvadoreno_db
DB_TYPE=mysql

# 3. Inicializar con datos completos
npm run db:init
```

#### Opción B: SQLite (Desarrollo)

```bash
# Ya configurado por defecto, solo inicializar
npm run db:init
```

### 3. Iniciar el Sistema

```bash
# Opción 1: Frontend + Backend juntos
npm run dev:full

# Opción 2: Solo backend
npm run server:dev

# Opción 3: Solo frontend
npm run dev
```

## 🏗️ Estructura del Proyecto

```
proyecto/
├── src/
│   ├── server/                 # Backend completo
│   │   ├── database/           # Modelos y esquemas
│   │   │   ├── models/         # Modelos con precios por temporada
│   │   │   │   ├── Accommodation.ts
│   │   │   │   ├── Reservation.ts
│   │   │   │   ├── Holiday.ts
│   │   │   │   └── User.ts
│   │   │   └── schema-mysql.sql # Schema completo MySQL
│   │   ├── routes/             # APIs REST
│   │   │   ├── accommodations-enhanced.ts
│   │   │   ├── pricing-enhanced.ts
│   │   │   └── ...
│   │   └── scripts/            # Scripts de inicialización
│   │       └── init-database-complete.ts
│   ├── lib/                    # Servicios y utilidades
│   │   ├── pricing-system-enhanced.ts
│   │   └── config.ts
│   ├── pages/                  # Frontend React
│   └── components/             # Componentes UI
├── club-salvadoreno-database-complete.sql # Schema SQL completo
├── .env.example               # Configuración de ejemplo
└── setup-development.js      # Script de configuración
```

## 📊 Funcionalidades del Sistema

### 💰 Sistema de Precios

#### Tipos de Temporada

| Temporada | Días | Descripción | Factor |
|-----------|------|-------------|---------|
| **Temporada Baja** | Lun-Jue | Precios base | 1.0x |
| **Temporada Alta** | Vie-Dom | Precios elevados | ~1.8x |
| **Días de Asueto** | Feriados | Precios premium | ~2.2x |

#### Ejemplos de Precios

| Alojamiento | Temp. Baja | Temp. Alta | Días Asueto |
|-------------|------------|------------|-------------|
| Apartamento 1A | $110 | $230 | $280 |
| Casa Surf Paradise | $200 | $350 | $400 |
| Suite Ejecutiva | $650 | $850 | $950 |

### 🏠 Alojamientos Disponibles

#### El Sunzal
- **6 Apartamentos**: Vista al mar, capacidad 2-6 personas
- **3 Casas**: Diseños especiales (Surf, Familiar, Vista)  
- **3 Suites Premium**: Lujo ejecutivo con servicios VIP

#### Corinto
- **2 Apartamentos**: Vista al lago
- **6 Casas**: Estilos variados (Lago, Ejecutiva, Rústica, etc.)

### 👥 Roles de Usuario

| Rol | Permisos | Funciones |
|-----|----------|-----------|
| **Super Admin** | Completo | Gestión total del sistema |
| **Atención al Miembro** | Alto | Reservas, usuarios, configuración |
| **Anfitrión** | Medio | Gestión de alojamientos, mensajes |
| **Monitor** | Medio | Supervisión y reportes |
| **Mercadeo** | Básico | Gestión de contenido y promociones |
| **Recepción** | Básico | Check-in/out, información |
| **Portería** | Básico | Control de acceso |
| **Miembro** | Usuario | Reservas propias, perfil |

## 🔧 API Endpoints

### Base URL: `http://localhost:3001/api`

#### Accommodations (Mejorado)
```
GET    /accommodations                    # Listar todos
GET    /accommodations/featured           # Destacados
GET    /accommodations/stats              # Estadísticas
GET    /accommodations/location/:location # Por ubicación
GET    /accommodations/:id                # Específico
GET    /accommodations/:id/rates          # Tarifas por temporada
POST   /accommodations/:id/calculate-price # Calcular precio
PUT    /accommodations/:id/prices         # Actualizar precios
PUT    /accommodations/:id/availability   # Cambiar disponibilidad
```

#### Pricing (Nuevo Sistema)
```
GET    /pricing/seasons                   # Info de temporadas
GET    /pricing/holidays                  # Días feriados
GET    /pricing/holidays/upcoming         # Próximos feriados
POST   /pricing/calculate                 # Calcular estadía
GET    /pricing/rates/:id                 # Tarifas de alojamiento
POST   /pricing/check-availability        # Verificar disponibilidad
GET    /pricing/day-type/:date            # Tipo de día
GET    /pricing/statistics/:id            # Estadísticas
```

### Ejemplo de Cálculo de Precio

```bash
curl -X POST http://localhost:3001/api/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "accommodationId": "sunzal-apt-1A",
    "checkIn": "2025-06-13",
    "checkOut": "2025-06-16"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "calculation": {
      "totalDays": 3,
      "nightsTemporadaBaja": 1,
      "nightsTemporadaAlta": 2,
      "nightsDiasAsueto": 0,
      "subtotalTemporadaBaja": 110,
      "subtotalTemporadaAlta": 460,
      "subtotalDiasAsueto": 0,
      "totalBeforeTaxes": 570,
      "taxes": 74.10,
      "totalPrice": 644.10
    }
  }
}
```

## 🗄️ Base de Datos

### Esquema Principal

El sistema utiliza **MySQL** con las siguientes tablas principales:

#### Precios por Temporada
- `accommodations` - Alojamientos con 3 campos de precio
- `holidays` - Calendario de feriados
- `pricing_seasons` - Configuración de temporadas

#### Reservas y Facturación  
- `reservations` - Reservas con cálculo automático
- `reservation_daily_breakdown` - Detalle día por día
- `accommodation_price_history` - Historial de cambios

#### Usuarios y Acceso
- `users` - Usuarios con 8 roles diferentes
- `access_records` - Control de entrada/salida
- `companion_billing_records` - Facturación de acompañantes

### Inicialización Automática

```bash
# Crear todas las tablas e insertar datos iniciales
npm run db:init

# Verificar estado de la base de datos
npm run db:status
```

## 🧪 Testing y Desarrollo

### Scripts Disponibles

```bash
npm run dev              # Frontend (Vite)
npm run server:dev       # Backend con recarga automática  
npm run dev:full         # Frontend + Backend juntos
npm test                 # Ejecutar tests
npm run typecheck        # Verificar TypeScript
npm run build            # Build de producción
npm run setup            # Configuración inicial
npm run db:init          # Inicializar base de datos
npm run db:status        # Estado de la base de datos
```

### Usuarios de Prueba

Todos tienen contraseña: `admin123`

| Usuario | Rol | Email |
|---------|-----|-------|
| `admin` | Super Admin | admin@clubsalvadoreno.com |
| `ghernandez` | Atención al Miembro | ghernandez@clubsalvadoreno.com |
| `mgarcia` | Anfitrión | mgarcia@clubsalvadoreno.com |
| `crodriguez` | Miembro | crodriguez@clubsalvadoreno.com |

## 🚀 Despliegue a Producción

### Variables de Entorno Críticas

```bash
# Base de datos
DATABASE_URL=mysql://user:password@host:3306/club_salvadoreno_db
DB_TYPE=mysql

# Seguridad
JWT_SECRET=your-secure-secret-key
NODE_ENV=production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=noreply@clubsalvadoreno.com
EMAIL_PASSWORD=your-app-password

# SMS (Opcional)
SMS_API_KEY=your-twilio-api-key
```

### Checklist de Producción

- [ ] Cambiar `JWT_SECRET` por clave segura
- [ ] Configurar proveedor de email real
- [ ] Configurar HTTPS
- [ ] Habilitar backups automáticos
- [ ] Configurar monitoreo
- [ ] Revisar límites de rate limiting
- [ ] Configurar variables de entorno en servidor

## 📞 Soporte y Mantenimiento

### Logs del Sistema

```bash
# Ver logs del servidor
tail -f logs/app.log

# Ver estado de salud
curl http://localhost:3001/health

# Ver información de la API
curl http://localhost:3001/api
```

### Mantenimiento de Precios

#### Actualizar Precios por Temporada

```bash
curl -X PUT http://localhost:3001/api/accommodations/sunzal-apt-1A/prices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "precioTemporadaBaja": 120,
    "precioTemporadaAlta": 250,
    "precioDiasAsueto": 300,
    "reason": "Ajuste de precios 2025"
  }'
```

#### Agregar Nuevo Feriado

```bash
curl -X POST http://localhost:3001/api/pricing/holidays \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-31",
    "name": "Fin de Año",
    "description": "Celebración de Fin de Año",
    "seasonType": "dias_asueto"
  }'
```

## 🔗 Enlaces Útiles

- **Aplicación**: http://localhost:8080
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **Base de Datos**: Configurada según .env

## 📝 Notas Técnicas

### Arquitectura
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MySQL (primary) / SQLite (development)
- **Autenticación**: JWT
- **UI**: TailwindCSS + Radix UI

### Características Técnicas
- ✅ TypeScript estricto en todo el proyecto
- ✅ Validación de datos con Zod
- ✅ Rate limiting y seguridad
- ✅ Logs estructurados
- ✅ Tests automatizados
- ✅ Hot reload en desarrollo
- ✅ Build optimizado para producción

---

**🎉 ¡El sistema está listo para usar con precios por temporada completamente funcionales!**

Para empezar rápidamente:
```bash
npm install
npm run dev:full
```

Luego visita http://localhost:8080 y inicia sesión con `admin` / `admin123`.

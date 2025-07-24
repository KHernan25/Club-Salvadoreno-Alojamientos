-- =====================================================
-- SCRIPT COMPLETO DE INICIALIZACIÓN MYSQL
-- CLUB SALVADOREÑO - SISTEMA DE ALOJAMIENTOS
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS club_salvadoreno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE club_salvadoreno_db;

-- =====================================================
-- 1. SISTEMA DE USUARIOS Y AUTENTICACIÓN
-- =====================================================

-- Tabla de usuarios principales
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(511) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
    role ENUM(
        'super_admin',
        'atencion_miembro', 
        'anfitrion',
        'monitor',
        'mercadeo',
        'recepcion',
        'porteria',
        'miembro'
    ) NOT NULL DEFAULT 'miembro',
    is_active BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    member_status ENUM('activo', 'inactivo', 'en_mora') DEFAULT 'activo',
    membership_type ENUM(
        'Viuda',
        'Honorario', 
        'Fundador',
        'Visitador Transeunte',
        'Visitador Especial',
        'Visitador Juvenil',
        'Contribuyente'
    ),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile_image TEXT
);

-- Tabla de tokens de autenticación
CREATE TABLE IF NOT EXISTS auth_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    type ENUM('access', 'refresh', 'reset_password', 'email_verification') NOT NULL,
    expires_at DATETIME NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de tokens de reseteo de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de preferencias de notificaciones
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id VARCHAR(36) PRIMARY KEY,
    email BOOLEAN DEFAULT TRUE,
    sms BOOLEAN DEFAULT FALSE,
    push BOOLEAN DEFAULT TRUE,
    booking_confirmations BOOLEAN DEFAULT TRUE,
    booking_reminders BOOLEAN DEFAULT TRUE,
    payment_reminders BOOLEAN DEFAULT TRUE,
    system_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 2. SISTEMA DE SOLICITUDES DE REGISTRO
-- =====================================================

-- Tabla de solicitudes de registro
CREATE TABLE IF NOT EXISTS registration_requests (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    membership_type ENUM(
        'Viuda',
        'Honorario', 
        'Fundador',
        'Visitador Transeunte',
        'Visitador Especial',
        'Visitador Juvenil',
        'Contribuyente'
    ) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by VARCHAR(36),
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 3. SISTEMA DE ALOJAMIENTOS
-- =====================================================

-- Tabla de alojamientos
CREATE TABLE IF NOT EXISTS accommodations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('habitacion', 'suite', 'apartamento', 'casa') NOT NULL,
    capacity INT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    images JSON,
    amenities JSON,
    availability_status ENUM('available', 'occupied', 'maintenance', 'disabled') DEFAULT 'available',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. SISTEMA DE RESERVAS
-- =====================================================

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    accommodation_id VARCHAR(36) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_nights INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    cancellation_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE
);

-- =====================================================
-- 5. SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'reservation', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 6. SISTEMA DE ACTIVIDAD Y LOGS
-- =====================================================

-- Tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 7. SISTEMA DE CONFIGURACIÓN
-- =====================================================

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id VARCHAR(36) PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. NUEVAS TABLAS PARA FUNCIONALIDADES ADICIONALES
-- =====================================================

-- Tabla de reviews/reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    accommodation_id VARCHAR(36) NOT NULL,
    reservation_id VARCHAR(36),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL
);

-- Tabla de mensajes/chat
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    recipient_id VARCHAR(36),
    message TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file') DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255),
    type ENUM('direct', 'group', 'support') DEFAULT 'direct',
    created_by VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de participantes en conversaciones
CREATE TABLE IF NOT EXISTS conversation_participants (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_active_participant (conversation_id, user_id, left_at)
);

-- =====================================================
-- CREACIÓN DE ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_member_status ON users(member_status);

-- Índices para auth_tokens
CREATE INDEX idx_auth_tokens_token ON auth_tokens(token);
CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at);
CREATE INDEX idx_auth_tokens_type ON auth_tokens(type);

-- Índices para password_reset_tokens
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Índices para notification_preferences
CREATE INDEX idx_notification_preferences_email ON notification_preferences(email);
CREATE INDEX idx_notification_preferences_sms ON notification_preferences(sms);
CREATE INDEX idx_notification_preferences_push ON notification_preferences(push);

-- Índices para registration_requests
CREATE INDEX idx_registration_requests_status ON registration_requests(status);
CREATE INDEX idx_registration_requests_email ON registration_requests(email);
CREATE INDEX idx_registration_requests_username ON registration_requests(username);

-- Índices para accommodations
CREATE INDEX idx_accommodations_type ON accommodations(type);
CREATE INDEX idx_accommodations_availability ON accommodations(availability_status);
CREATE INDEX idx_accommodations_active ON accommodations(is_active);

-- Índices para reservations
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_accommodation_id ON reservations(accommodation_id);
CREATE INDEX idx_reservations_check_in ON reservations(check_in_date);
CREATE INDEX idx_reservations_check_out ON reservations(check_out_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Índices para activity_logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Índices para system_config
CREATE INDEX idx_system_config_key ON system_config(config_key);
CREATE INDEX idx_system_config_public ON system_config(is_public);

-- Índices para reviews
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_accommodation_id ON reviews(accommodation_id);
CREATE INDEX idx_reviews_reservation_id ON reviews(reservation_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- Índices para messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Índices para conversations
CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversations_type ON conversations(type);

-- Índices para conversation_participants
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);

-- =====================================================
-- DATOS INICIALES DE DESARROLLO
-- =====================================================

-- Usuario super administrador por defecto
INSERT IGNORE INTO users (
    id, 
    first_name, 
    last_name, 
    username, 
    email, 
    password, 
    role, 
    is_active, 
    status,
    member_status,
    membership_type
) VALUES 
(
    'admin-001',
    'Super',
    'Admin',
    'admin',
    'admin@clubsalvadoreno.com',
    '$2b$10$8K1p/a0dClzm4O9bWv9SzeI9wzh.I2t.BgQ4YEHvRmKi8Z.QL2QzG', -- password: admin123
    'super_admin',
    TRUE,
    'approved',
    'activo',
    'Fundador'
);

-- Usuarios de ejemplo para diferentes roles
INSERT IGNORE INTO users (
    id, 
    first_name, 
    last_name, 
    username, 
    email, 
    password, 
    role, 
    is_active, 
    status,
    member_status,
    membership_type
) VALUES 
(
    'user-001',
    'Gabriel',
    'Hernandez',
    'ghernandez',
    'ghernandez@clubsalvadoreno.com',
    '$2b$10$8K1p/a0dClzm4O9bWv9SzeI9wzh.I2t.BgQ4YEHvRmKi8Z.QL2QzG', -- password: admin123
    'atencion_miembro',
    TRUE,
    'approved',
    'activo',
    'Contribuyente'
),
(
    'user-002',
    'Maria',
    'Garcia',
    'mgarcia',
    'mgarcia@clubsalvadoreno.com',
    '$2b$10$8K1p/a0dClzm4O9bWv9SzeI9wzh.I2t.BgQ4YEHvRmKi8Z.QL2QzG', -- password: admin123
    'anfitrion',
    TRUE,
    'approved',
    'activo',
    'Visitador Especial'
),
(
    'user-003',
    'Carlos',
    'Rodriguez',
    'crodriguez',
    'crodriguez@clubsalvadoreno.com',
    '$2b$10$8K1p/a0dClzm4O9bWv9SzeI9wzh.I2t.BgQ4YEHvRmKi8Z.QL2QzG', -- password: admin123
    'miembro',
    TRUE,
    'approved',
    'activo',
    'Visitador Juvenil'
);

-- Los datos reales de alojamientos se insertan en un script separado (real-accommodations-data.sql)
-- Para cargar los datos reales, ejecutar: mysql -u root -p club_salvadoreno_db < real-accommodations-data.sql

-- Configuración inicial del sistema
INSERT IGNORE INTO system_config (
    id,
    config_key,
    config_value,
    description,
    is_public
) VALUES 
(
    'conf-001',
    'site_title',
    'Club Salvadoreño - Sistema de Alojamientos',
    'Título del sitio web',
    TRUE
),
(
    'conf-002',
    'booking_advance_days',
    '30',
    'Días máximos de anticipación para reservas',
    FALSE
),
(
    'conf-003',
    'max_reservation_days',
    '7',
    'Máximo de días por reserva',
    FALSE
),
(
    'conf-004',
    'email_notifications_enabled',
    'true',
    'Habilitar notificaciones por email',
    FALSE
),
(
    'conf-005',
    'sms_notifications_enabled',
    'false',
    'Habilitar notificaciones por SMS',
    FALSE
);

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 
    TABLE_NAME as 'Tabla Creada',
    TABLE_ROWS as 'Filas',
    CREATE_TIME as 'Fecha Creación'
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'club_salvadoreno_db'
ORDER BY 
    TABLE_NAME;

COMMIT;

-- Mensaje de finalización
SELECT 'Base de datos MySQL club_salvadoreno_db inicializada correctamente' AS 'Status';

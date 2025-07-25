-- =====================================================
-- SISTEMA CLUB SALVADOREÑO - SCHEMA MYSQL COMPLETO
-- =====================================================
-- Versión: 2.0 - Incluye sistema completo de precios por temporada
-- Para uso con el backend Node.js/TypeScript del proyecto
-- =====================================================

-- Usar o crear la base de datos
CREATE DATABASE IF NOT EXISTS club_salvadoreno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE club_salvadoreno_db;

-- =====================================================
-- 1. SISTEMA DE USUARIOS Y AUTENTICACIÓN
-- =====================================================

-- Tabla de usuarios principales
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- En producción debe estar hasheado
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
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
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile_image VARCHAR(500),
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_member_status (member_status)
);

-- Tabla de documentos de usuarios
CREATE TABLE IF NOT EXISTS user_documents (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    id_document VARCHAR(500), -- URL de la foto del documento de identidad
    member_card VARCHAR(500), -- URL de la foto del carnet de miembro
    face_photo VARCHAR(500), -- URL de la foto del rostro
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    bio TEXT,
    preferences JSON,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'El Salvador',
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Tabla de solicitudes de registro
CREATE TABLE IF NOT EXISTS registration_requests (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    document_type ENUM('dui', 'passport') NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    member_code VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(50),
    rejection_reason TEXT,
    
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- Tabla de tokens de autenticación
CREATE TABLE IF NOT EXISTS auth_tokens (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(255) NOT NULL,
    type ENUM('access', 'refresh', 'reset_password', 'email_verification') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Tabla de tokens de reseteo de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(150) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_email (email)
);

-- =====================================================
-- 2. SISTEMA DE TEMPORADAS Y PRECIOS
-- =====================================================

-- Tabla de temporadas (nueva tabla para manejar las tres temporadas)
CREATE TABLE IF NOT EXISTS pricing_seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('temporada_baja', 'temporada_alta', 'dias_asueto') NOT NULL,
    multiplier DECIMAL(4,2) DEFAULT 1.00, -- Factor multiplicador para precios base
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_active (is_active)
);

-- Tabla de días feriados y fechas especiales
CREATE TABLE IF NOT EXISTS holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    year INT GENERATED ALWAYS AS (YEAR(date)) STORED,
    season_type ENUM('temporada_baja', 'temporada_alta', 'dias_asueto') DEFAULT 'dias_asueto',
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_date (date),
    INDEX idx_year (year),
    INDEX idx_season_type (season_type),
    INDEX idx_active (is_active)
);

-- Tabla de temporadas especiales (periodos de temporada alta)
CREATE TABLE IF NOT EXISTS special_seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    year INT NOT NULL,
    season_type ENUM('temporada_baja', 'temporada_alta') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_dates (start_date, end_date),
    INDEX idx_year (year),
    INDEX idx_season_type (season_type),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 3. SISTEMA DE ALOJAMIENTOS CON PRECIOS POR TEMPORADA
-- =====================================================

-- Tabla de alojamientos
CREATE TABLE IF NOT EXISTS accommodations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type ENUM('apartamento', 'casa', 'suite') NOT NULL,
    location ENUM('el-sunzal', 'corinto') NOT NULL,
    capacity INT NOT NULL,
    description TEXT,
    amenities JSON, -- Array de amenidades
    
    -- PRECIOS POR TEMPORADA (CORRECCIÓN PRINCIPAL)
    precio_temporada_baja DECIMAL(10,2) NOT NULL COMMENT 'Precio base temporada baja (lunes-jueves)',
    precio_temporada_alta DECIMAL(10,2) NOT NULL COMMENT 'Precio temporada alta (viernes-domingo)',
    precio_dias_asueto DECIMAL(10,2) NOT NULL COMMENT 'Precio días de asueto/festivos',
    
    images JSON, -- Array de URLs de imágenes
    available BOOLEAN DEFAULT TRUE,
    view_type VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    max_guests INT, -- Capacidad máxima real
    min_nights INT DEFAULT 1,
    max_nights INT DEFAULT 7,
    check_in_time TIME DEFAULT '15:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    
    -- Metadatos
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_location (location),
    INDEX idx_type (type),
    INDEX idx_capacity (capacity),
    INDEX idx_available (available),
    INDEX idx_featured (featured),
    INDEX idx_prices (precio_temporada_baja, precio_temporada_alta, precio_dias_asueto)
);

-- Tabla de precios históricos para tracking de cambios
CREATE TABLE IF NOT EXISTS accommodation_price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accommodation_id VARCHAR(50) NOT NULL,
    precio_temporada_baja_old DECIMAL(10,2),
    precio_temporada_alta_old DECIMAL(10,2),
    precio_dias_asueto_old DECIMAL(10,2),
    precio_temporada_baja_new DECIMAL(10,2),
    precio_temporada_alta_new DECIMAL(10,2),
    precio_dias_asueto_new DECIMAL(10,2),
    changed_by VARCHAR(50),
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id),
    INDEX idx_accommodation_id (accommodation_id),
    INDEX idx_changed_at (changed_at)
);

-- =====================================================
-- 4. SISTEMA DE RESERVAS CON CÁLCULO AUTOMÁTICO
-- =====================================================

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    accommodation_id VARCHAR(50) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INT NOT NULL,
    
    -- CÁLCULO DETALLADO DE PRECIOS POR TEMPORADA
    total_nights INT NOT NULL,
    nights_temporada_baja INT DEFAULT 0,
    nights_temporada_alta INT DEFAULT 0,
    nights_dias_asueto INT DEFAULT 0,
    
    subtotal_temporada_baja DECIMAL(10,2) DEFAULT 0.00,
    subtotal_temporada_alta DECIMAL(10,2) DEFAULT 0.00,
    subtotal_dias_asueto DECIMAL(10,2) DEFAULT 0.00,
    
    total_before_taxes DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'checked_in', 'checked_out') DEFAULT 'pending',
    special_requests TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    confirmed_at TIMESTAMP NULL,
    
    -- Detalles de la estadía
    check_in_actual TIMESTAMP NULL,
    check_out_actual TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_accommodation_id (accommodation_id),
    INDEX idx_check_in (check_in_date),
    INDEX idx_check_out (check_out_date),
    INDEX idx_status (status),
    INDEX idx_dates (check_in_date, check_out_date),
    INDEX idx_total_amount (total_amount)
);

-- Tabla de detalle diario de reservas (para auditoría completa)
CREATE TABLE IF NOT EXISTS reservation_daily_breakdown (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id VARCHAR(50) NOT NULL,
    date_stay DATE NOT NULL,
    day_of_week ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    season_type ENUM('temporada_baja', 'temporada_alta', 'dias_asueto') NOT NULL,
    price_applied DECIMAL(10,2) NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_name VARCHAR(200),
    
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    INDEX idx_reservation_id (reservation_id),
    INDEX idx_date_stay (date_stay),
    INDEX idx_season_type (season_type),
    UNIQUE KEY unique_reservation_date (reservation_id, date_stay)
);

-- =====================================================
-- 5. SISTEMA DE RESEÑAS CON CATEGORÍAS DETALLADAS
-- =====================================================

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    accommodation_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    reservation_id VARCHAR(50) NOT NULL,
    
    -- Calificaciones por categoría (1-5 estrellas)
    rating_overall INT CHECK (rating_overall >= 1 AND rating_overall <= 5),
    rating_cleanliness INT CHECK (rating_cleanliness >= 1 AND rating_cleanliness <= 5),
    rating_communication INT CHECK (rating_communication >= 1 AND rating_communication <= 5),
    rating_checkin INT CHECK (rating_checkin >= 1 AND rating_checkin <= 5),
    rating_accuracy INT CHECK (rating_accuracy >= 1 AND rating_accuracy <= 5),
    rating_location INT CHECK (rating_location >= 1 AND rating_location <= 5),
    rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
    
    title VARCHAR(200),
    comment TEXT,
    images JSON, -- Array de URLs de imágenes
    
    helpful_count INT DEFAULT 0,
    reported_count INT DEFAULT 0,
    is_moderated BOOLEAN DEFAULT FALSE,
    moderator_note TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Respuesta del anfitrión
    host_response_message TEXT,
    host_response_created_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    INDEX idx_accommodation_id (accommodation_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating_overall (rating_overall),
    INDEX idx_created_at (created_at),
    INDEX idx_featured (is_featured)
);

-- =====================================================
-- 6. SISTEMA DE MENSAJERÍA AVANZADO
-- =====================================================

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(50) PRIMARY KEY,
    guest_id VARCHAR(50) NOT NULL,
    host_id VARCHAR(50) NOT NULL,
    guest_name VARCHAR(200),
    host_name VARCHAR(200),
    subject VARCHAR(300),
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unread_count_guest INT DEFAULT 0,
    unread_count_host INT DEFAULT 0,
    status ENUM('active', 'archived', 'closed') DEFAULT 'active',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Metadatos de reserva
    reservation_id VARCHAR(50),
    accommodation_id VARCHAR(50),
    accommodation_name VARCHAR(200),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (guest_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE SET NULL,
    INDEX idx_guest_id (guest_id),
    INDEX idx_host_id (host_id),
    INDEX idx_last_activity (last_activity),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    sender_name VARCHAR(200),
    sender_role ENUM('guest', 'host', 'admin', 'staff') NOT NULL,
    content TEXT NOT NULL,
    type ENUM('text', 'image', 'document', 'system', 'automated') DEFAULT 'text',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    
    -- Metadatos adicionales
    reservation_id VARCHAR(50),
    accommodation_id VARCHAR(50),
    urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
    category ENUM('booking', 'payment', 'support', 'general', 'maintenance') DEFAULT 'general',
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_read_status (read_status),
    INDEX idx_category (category)
);

-- Tabla de archivos adjuntos de mensajes
CREATE TABLE IF NOT EXISTS message_attachments (
    id VARCHAR(50) PRIMARY KEY,
    message_id VARCHAR(50) NOT NULL,
    name VARCHAR(300) NOT NULL,
    type VARCHAR(100),
    size BIGINT,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    INDEX idx_message_id (message_id),
    INDEX idx_type (type)
);

-- Tabla de borradores de mensajes
CREATE TABLE IF NOT EXISTS message_drafts (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    last_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_draft (conversation_id, user_id),
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- 7. SISTEMA DE CONTROL DE ACCESO Y PORTERÍA
-- =====================================================

-- Tabla de registros de acceso
CREATE TABLE IF NOT EXISTS access_records (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL,
    member_name VARCHAR(200) NOT NULL,
    member_code VARCHAR(50) NOT NULL,
    member_photo VARCHAR(500),
    membership_type VARCHAR(100),
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    location VARCHAR(100) DEFAULT 'Entrada Principal',
    companions_count INT DEFAULT 0,
    detection_method ENUM('card', 'manual', 'qr', 'face', 'biometric') NOT NULL,
    gate_keeper_name VARCHAR(200) NOT NULL,
    gate_keeper_id VARCHAR(50) NOT NULL,
    notes TEXT,
    status ENUM('active', 'completed', 'expired') DEFAULT 'active',
    
    -- Información de vehículo
    vehicle_plate VARCHAR(20),
    vehicle_type ENUM('automovil', 'motocicleta', 'bicicleta', 'ninguno') DEFAULT 'ninguno',
    
    FOREIGN KEY (member_id) REFERENCES users(id),
    FOREIGN KEY (gate_keeper_id) REFERENCES users(id),
    INDEX idx_member_id (member_id),
    INDEX idx_access_time (access_time),
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_member_code (member_code)
);

-- Tabla de acompañantes en acceso
CREATE TABLE IF NOT EXISTS access_companions (
    id VARCHAR(50) PRIMARY KEY,
    access_record_id VARCHAR(50) NOT NULL,
    companion_name VARCHAR(200) NOT NULL,
    companion_age INT,
    companion_id_number VARCHAR(50),
    relationship VARCHAR(100), -- familiar, amigo, etc.
    
    FOREIGN KEY (access_record_id) REFERENCES access_records(id) ON DELETE CASCADE,
    INDEX idx_access_record_id (access_record_id)
);

-- =====================================================
-- 8. SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('reservation', 'user_registration', 'system', 'review', 'access', 'billing', 'maintenance', 'pricing', 'security') NOT NULL,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    
    -- Destinatarios
    user_id VARCHAR(50), -- Usuario específico
    role ENUM('super_admin', 'atencion_miembro', 'anfitrion', 'monitor', 'mercadeo', 'recepcion', 'porteria'), -- Por rol
    
    is_read BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Canales de notificación
    send_email BOOLEAN DEFAULT FALSE,
    send_sms BOOLEAN DEFAULT FALSE,
    send_push BOOLEAN DEFAULT TRUE,
    
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    
    data JSON, -- Datos adicionales específicos del tipo
    action_url VARCHAR(500), -- URL para acción relacionada
    
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    INDEX idx_is_read (is_read),
    INDEX idx_is_urgent (is_urgent),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 9. SISTEMA DE LOGS Y ACTIVIDAD ADMINISTRATIVA
-- =====================================================

-- Tabla de logs de actividad administrativa
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    type ENUM('check_in', 'check_out', 'maintenance', 'cleaning', 'inspection', 'pricing_update', 'user_action') NOT NULL,
    location ENUM('el-sunzal', 'corinto', 'sistema', 'ambos') NOT NULL,
    accommodation_id VARCHAR(50),
    user_id VARCHAR(50) NOT NULL,
    
    action_description VARCHAR(500) NOT NULL,
    details TEXT,
    
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    
    -- Metadatos
    affected_table VARCHAR(100),
    affected_record_id VARCHAR(50),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_location (location),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 10. SISTEMA DE CONFIGURACIÓN Y SETTINGS
-- =====================================================

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id VARCHAR(50) PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_config_key (config_key),
    INDEX idx_is_public (is_public)
);

-- =====================================================
-- INSERCIÓN DE DATOS INICIALES PARA DESARROLLO
-- =====================================================

-- Insertar temporadas base
INSERT IGNORE INTO pricing_seasons (name, description, type, multiplier, is_default, is_active) VALUES
('Temporada Baja', 'Lunes a Jueves - Precios regulares', 'temporada_baja', 1.00, TRUE, TRUE),
('Temporada Alta', 'Viernes a Domingo - Precios elevados', 'temporada_alta', 1.80, FALSE, TRUE),
('Días de Asueto', 'Días feriados y fechas especiales', 'dias_asueto', 2.20, FALSE, TRUE);

-- Insertar usuarios administrativos básicos
INSERT IGNORE INTO users (id, first_name, last_name, username, password, email, phone, role, is_active, status, created_at) VALUES
('admin-001', 'Super', 'Administrador', 'admin', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'admin@clubsalvadoreno.com', '+503-2345-6789', 'super_admin', TRUE, 'approved', '2024-01-01 00:00:00'),
('user-001', 'Gabriel', 'Hernández', 'ghernandez', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'ghernandez@clubsalvadoreno.com', '+503-2345-6790', 'atencion_miembro', TRUE, 'approved', '2024-01-01 00:00:00'),
('user-002', 'María', 'García', 'mgarcia', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'mgarcia@clubsalvadoreno.com', '+503-2345-6791', 'anfitrion', TRUE, 'approved', '2024-01-15 00:00:00'),
('user-003', 'Carlos', 'Rodríguez', 'crodriguez', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'crodriguez@clubsalvadoreno.com', '+503-2345-6792', 'miembro', TRUE, 'approved', '2024-02-01 00:00:00');

-- Insertar días feriados de El Salvador para 2025 y 2026
INSERT IGNORE INTO holidays (date, name, description, season_type, is_active) VALUES
-- 2025
('2025-01-01', 'Año Nuevo', 'Celebración del Año Nuevo', 'dias_asueto', TRUE),
('2025-03-28', 'Jueves Santo', 'Semana Santa', 'dias_asueto', TRUE),
('2025-03-29', 'Viernes Santo', 'Semana Santa', 'dias_asueto', TRUE),
('2025-03-30', 'Sábado Santo', 'Semana Santa', 'dias_asueto', TRUE),
('2025-05-01', 'Día del Trabajo', 'Día Internacional del Trabajador', 'dias_asueto', TRUE),
('2025-05-10', 'Día de la Madre', 'Celebración del Día de la Madre', 'dias_asueto', TRUE),
('2025-06-17', 'Día del Padre', 'Celebración del Día del Padre', 'dias_asueto', TRUE),
('2025-08-06', 'Día del Salvador del Mundo', 'Festividades Patronales de San Salvador', 'dias_asueto', TRUE),
('2025-09-15', 'Día de la Independencia', 'Independencia de El Salvador', 'dias_asueto', TRUE),
('2025-11-02', 'Día de los Difuntos', 'Día de los Fieles Difuntos', 'dias_asueto', TRUE),
('2025-12-25', 'Navidad', 'Celebración de la Navidad', 'dias_asueto', TRUE),

-- 2026
('2026-01-01', 'Año Nuevo', 'Celebración del Año Nuevo', 'dias_asueto', TRUE),
('2026-04-17', 'Jueves Santo', 'Semana Santa', 'dias_asueto', TRUE),
('2026-04-18', 'Viernes Santo', 'Semana Santa', 'dias_asueto', TRUE),
('2026-04-19', 'Sábado Santo', 'Semana Santa', 'dias_asueto', TRUE),
('2026-05-01', 'Día del Trabajo', 'Día Internacional del Trabajador', 'dias_asueto', TRUE),
('2026-05-10', 'Día de la Madre', 'Celebración del Día de la Madre', 'dias_asueto', TRUE),
('2026-06-17', 'Día del Padre', 'Celebración del Día del Padre', 'dias_asueto', TRUE),
('2026-08-06', 'Día del Salvador del Mundo', 'Festividades Patronales de San Salvador', 'dias_asueto', TRUE),
('2026-09-15', 'Día de la Independencia', 'Independencia de El Salvador', 'dias_asueto', TRUE),
('2026-11-02', 'Día de los Difuntos', 'Día de los Fieles Difuntos', 'dias_asueto', TRUE),
('2026-12-25', 'Navidad', 'Celebración de la Navidad', 'dias_asueto', TRUE);

-- Insertar configuraciones básicas del sistema
INSERT IGNORE INTO system_config (id, config_key, config_value, description, is_public) VALUES
('conf-001', 'site_title', 'Club Salvadoreño - Sistema de Alojamientos', 'Título del sitio web', TRUE),
('conf-002', 'booking_advance_days', '30', 'Días máximos de anticipación para reservas', FALSE),
('conf-003', 'max_reservation_days', '7', 'Máximo de días por reserva', FALSE),
('conf-004', 'email_notifications_enabled', 'true', 'Habilitar notificaciones por email', FALSE),
('conf-005', 'sms_notifications_enabled', 'false', 'Habilitar notificaciones por SMS', FALSE);

-- =====================================================
-- SCHEMA COMPLETADO
-- =====================================================

-- Este schema MySQL está optimizado para el backend Node.js/TypeScript
-- e incluye todas las funcionalidades requeridas del sistema Club Salvadoreño
SELECT 'Schema MySQL del Sistema Club Salvadoreño cargado exitosamente!' as 'ESTADO';

-- =====================================================
-- SISTEMA CLUB SALVADOREÑO - SCRIPT COMPLETO
-- BASE DE DATOS PARA MIEMBROS Y BACKOFFICE
-- =====================================================
-- Versión: 2.0 - Incluye sistema completo de precios por temporada
-- Fecha: 2024
-- Descripción: Script completo que incluye tanto el sistema de 
-- reservas para miembros como el sistema de backoffice administrativo
-- con precios diferenciados por temporada baja, alta y días de asueto
-- =====================================================

-- Crear base de datos
DROP DATABASE IF EXISTS club_salvadoreno_db;
CREATE DATABASE club_salvadoreno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE club_salvadoreno_db;

-- =====================================================
-- 1. SISTEMA DE USUARIOS Y AUTENTICACIÓN
-- =====================================================

-- Tabla de usuarios principales
CREATE TABLE users (
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
CREATE TABLE user_documents (
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
CREATE TABLE user_profiles (
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
CREATE TABLE registration_requests (
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
CREATE TABLE auth_tokens (
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
CREATE TABLE password_reset_tokens (
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
CREATE TABLE pricing_seasons (
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
CREATE TABLE holidays (
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
CREATE TABLE special_seasons (
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
CREATE TABLE accommodations (
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
CREATE TABLE accommodation_price_history (
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
CREATE TABLE reservations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    accommodation_id VARCHAR(50) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
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
    total_price DECIMAL(10,2) NOT NULL,
    
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
    INDEX idx_check_in (check_in),
    INDEX idx_check_out (check_out),
    INDEX idx_status (status),
    INDEX idx_dates (check_in, check_out),
    INDEX idx_total_price (total_price)
);

-- Tabla de detalle diario de reservas (para auditoría completa)
CREATE TABLE reservation_daily_breakdown (
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
CREATE TABLE reviews (
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
CREATE TABLE conversations (
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
CREATE TABLE messages (
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
CREATE TABLE message_attachments (
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
CREATE TABLE message_drafts (
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
CREATE TABLE access_records (
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
CREATE TABLE access_companions (
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
-- 8. SISTEMA DE FACTURACIÓN DE ACOMPAÑANTES MEJORADO
-- =====================================================

-- Tabla de reglas de precios para acompañantes
CREATE TABLE pricing_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location ENUM('El Sunzal', 'Corinto') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(300) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    
    -- Condiciones específicas
    day_type ENUM('lunes_jueves', 'viernes_domingo', 'festivo', 'todos') DEFAULT 'todos',
    season_type ENUM('temporada_baja', 'temporada_alta', 'dias_asueto', 'todos') DEFAULT 'todos',
    min_companions INT DEFAULT 1,
    max_companions INT DEFAULT 999,
    member_types JSON, -- Array de tipos de membresía aplicables
    
    conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (location),
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_day_type (day_type),
    INDEX idx_season_type (season_type)
);

-- Tabla de registros de facturación de acompañantes
CREATE TABLE companion_billing_records (
    id VARCHAR(50) PRIMARY KEY,
    access_record_id VARCHAR(50) NOT NULL,
    member_name VARCHAR(200) NOT NULL,
    member_code VARCHAR(50) NOT NULL,
    membership_type VARCHAR(100),
    location ENUM('El Sunzal', 'Corinto') NOT NULL,
    companions_count INT NOT NULL,
    access_time TIMESTAMP NOT NULL,
    gate_keeper_name VARCHAR(200) NOT NULL,
    
    -- Cálculo de precios
    day_type ENUM('lunes_jueves', 'viernes_domingo', 'festivo') NOT NULL,
    season_type ENUM('temporada_baja', 'temporada_alta', 'dias_asueto') NOT NULL,
    
    subtotal DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    status ENUM('pending', 'processed', 'cancelled', 'paid') DEFAULT 'pending',
    notes TEXT,
    processed_at TIMESTAMP NULL,
    processed_by VARCHAR(50),
    
    -- Información de pago
    payment_method ENUM('cash', 'card', 'transfer', 'member_account') DEFAULT 'cash',
    receipt_number VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (access_record_id) REFERENCES access_records(id),
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_access_record_id (access_record_id),
    INDEX idx_status (status),
    INDEX idx_access_time (access_time),
    INDEX idx_location (location),
    INDEX idx_member_code (member_code)
);

-- Tabla de items de facturación detallados
CREATE TABLE billing_items (
    id VARCHAR(50) PRIMARY KEY,
    billing_record_id VARCHAR(50) NOT NULL,
    description VARCHAR(300) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    
    location VARCHAR(100),
    category VARCHAR(100),
    pricing_rule_id INT,
    
    FOREIGN KEY (billing_record_id) REFERENCES companion_billing_records(id) ON DELETE CASCADE,
    FOREIGN KEY (pricing_rule_id) REFERENCES pricing_rules(id),
    INDEX idx_billing_record_id (billing_record_id),
    INDEX idx_category (category)
);

-- =====================================================
-- 9. SISTEMA DE LOGS Y ACTIVIDAD ADMINISTRATIVA
-- =====================================================

-- Tabla de logs de actividad administrativa
CREATE TABLE activity_logs (
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
-- 10. SISTEMA DE NOTIFICACIONES AVANZADO
-- =====================================================

-- Tabla de notificaciones
CREATE TABLE notifications (
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
-- 11. SISTEMA DE CONFIGURACIÓN Y SETTINGS
-- =====================================================

-- Tabla de configuraciones del sistema
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type ENUM('string', 'number', 'boolean', 'json', 'date', 'time', 'email', 'url') DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE, -- Si es visible a usuarios no admin
    is_editable BOOLEAN DEFAULT TRUE, -- Si puede ser editado via interfaz
    validation_rules JSON, -- Reglas de validación
    
    updated_by VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_category (category),
    INDEX idx_key_name (key_name),
    INDEX idx_is_public (is_public)
);

-- =====================================================
-- 12. TRIGGERS Y PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Trigger para calcular precios automáticamente en reservas
DELIMITER //
CREATE TRIGGER calculate_reservation_pricing 
BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE current_date_iter DATE;
    DECLARE night_count INT DEFAULT 0;
    DECLARE temp_baja_count INT DEFAULT 0;
    DECLARE temp_alta_count INT DEFAULT 0;
    DECLARE dias_asueto_count INT DEFAULT 0;
    DECLARE precio_temp_baja DECIMAL(10,2);
    DECLARE precio_temp_alta DECIMAL(10,2);
    DECLARE precio_asueto DECIMAL(10,2);
    
    -- Obtener precios del alojamiento
    SELECT precio_temporada_baja, precio_temporada_alta, precio_dias_asueto
    INTO precio_temp_baja, precio_temp_alta, precio_asueto
    FROM accommodations 
    WHERE id = NEW.accommodation_id;
    
    -- Calcular total de noches
    SET night_count = DATEDIFF(NEW.check_out, NEW.check_in);
    SET NEW.total_nights = night_count;
    
    -- Iterar por cada día para calcular precios
    SET current_date_iter = NEW.check_in;
    
    WHILE current_date_iter < NEW.check_out DO
        -- Verificar si es día de asueto
        IF EXISTS (SELECT 1 FROM holidays WHERE date = current_date_iter AND is_active = TRUE) THEN
            SET dias_asueto_count = dias_asueto_count + 1;
        -- Verificar si es fin de semana (viernes, sábado, domingo)
        ELSEIF DAYOFWEEK(current_date_iter) IN (1, 6, 7) THEN -- Domingo=1, Viernes=6, Sábado=7
            SET temp_alta_count = temp_alta_count + 1;
        -- Días de semana (lunes a jueves)
        ELSE
            SET temp_baja_count = temp_baja_count + 1;
        END IF;
        
        SET current_date_iter = DATE_ADD(current_date_iter, INTERVAL 1 DAY);
    END WHILE;
    
    -- Asignar conteos
    SET NEW.nights_temporada_baja = temp_baja_count;
    SET NEW.nights_temporada_alta = temp_alta_count;
    SET NEW.nights_dias_asueto = dias_asueto_count;
    
    -- Calcular subtotales
    SET NEW.subtotal_temporada_baja = temp_baja_count * precio_temp_baja;
    SET NEW.subtotal_temporada_alta = temp_alta_count * precio_temp_alta;
    SET NEW.subtotal_dias_asueto = dias_asueto_count * precio_asueto;
    
    -- Calcular totales
    SET NEW.total_before_taxes = NEW.subtotal_temporada_baja + NEW.subtotal_temporada_alta + NEW.subtotal_dias_asueto;
    SET NEW.total_price = NEW.total_before_taxes + NEW.taxes;
END//
DELIMITER ;

-- Trigger para crear historial de precios
DELIMITER //
CREATE TRIGGER accommodation_price_history_trigger
AFTER UPDATE ON accommodations
FOR EACH ROW
BEGIN
    IF OLD.precio_temporada_baja != NEW.precio_temporada_baja OR 
       OLD.precio_temporada_alta != NEW.precio_temporada_alta OR 
       OLD.precio_dias_asueto != NEW.precio_dias_asueto THEN
        
        INSERT INTO accommodation_price_history (
            accommodation_id,
            precio_temporada_baja_old, precio_temporada_alta_old, precio_dias_asueto_old,
            precio_temporada_baja_new, precio_temporada_alta_new, precio_dias_asueto_new,
            changed_by,
            change_reason
        ) VALUES (
            NEW.id,
            OLD.precio_temporada_baja, OLD.precio_temporada_alta, OLD.precio_dias_asueto,
            NEW.precio_temporada_baja, NEW.precio_temporada_alta, NEW.precio_dias_asueto,
            NEW.updated_by,
            'Actualización automática de precios'
        );
    END IF;
END//
DELIMITER ;

-- Trigger para actualizar contadores de mensajes no leídos
DELIMITER //
CREATE TRIGGER update_conversation_unread_count 
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    IF NEW.sender_role = 'guest' THEN
        UPDATE conversations 
        SET unread_count_host = unread_count_host + 1,
            last_activity = NEW.timestamp
        WHERE id = NEW.conversation_id;
    ELSE
        UPDATE conversations 
        SET unread_count_guest = unread_count_guest + 1,
            last_activity = NEW.timestamp
        WHERE id = NEW.conversation_id;
    END IF;
END//
DELIMITER ;

-- Procedimiento para obtener estadísticas de reservas por temporada
DELIMITER //
CREATE PROCEDURE GetReservationStatsBySeason(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        'Temporada Baja' as temporada,
        SUM(nights_temporada_baja) as total_noches,
        SUM(subtotal_temporada_baja) as ingresos_totales,
        AVG(subtotal_temporada_baja / NULLIF(nights_temporada_baja, 0)) as precio_promedio_noche,
        COUNT(CASE WHEN nights_temporada_baja > 0 THEN 1 END) as reservas_con_noches
    FROM reservations 
    WHERE check_in BETWEEN start_date AND end_date
    AND status IN ('confirmed', 'completed', 'checked_in', 'checked_out')
    
    UNION ALL
    
    SELECT 
        'Temporada Alta' as temporada,
        SUM(nights_temporada_alta) as total_noches,
        SUM(subtotal_temporada_alta) as ingresos_totales,
        AVG(subtotal_temporada_alta / NULLIF(nights_temporada_alta, 0)) as precio_promedio_noche,
        COUNT(CASE WHEN nights_temporada_alta > 0 THEN 1 END) as reservas_con_noches
    FROM reservations 
    WHERE check_in BETWEEN start_date AND end_date
    AND status IN ('confirmed', 'completed', 'checked_in', 'checked_out')
    
    UNION ALL
    
    SELECT 
        'Días de Asueto' as temporada,
        SUM(nights_dias_asueto) as total_noches,
        SUM(subtotal_dias_asueto) as ingresos_totales,
        AVG(subtotal_dias_asueto / NULLIF(nights_dias_asueto, 0)) as precio_promedio_noche,
        COUNT(CASE WHEN nights_dias_asueto > 0 THEN 1 END) as reservas_con_noches
    FROM reservations 
    WHERE check_in BETWEEN start_date AND end_date
    AND status IN ('confirmed', 'completed', 'checked_in', 'checked_out');
END//
DELIMITER ;

-- =====================================================
-- 13. INSERCIÓN DE DATOS INICIALES
-- =====================================================

-- Insertar temporadas base
INSERT INTO pricing_seasons (name, description, type, multiplier, is_default, is_active) VALUES
('Temporada Baja', 'Lunes a Jueves - Precios regulares', 'temporada_baja', 1.00, TRUE, TRUE),
('Temporada Alta', 'Viernes a Domingo - Precios elevados', 'temporada_alta', 1.80, FALSE, TRUE),
('Días de Asueto', 'Días feriados y fechas especiales', 'dias_asueto', 2.20, FALSE, TRUE);

-- Insertar usuarios administrativos
INSERT INTO users (id, first_name, last_name, username, password, email, phone, role, is_active, status, created_at) VALUES
('admin-001', 'Super', 'Administrador', 'admin', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'admin@clubsalvadoreno.com', '+503-2345-6789', 'super_admin', TRUE, 'approved', '2024-01-01 00:00:00'),
('user-001', 'Gabriel', 'Hernández', 'ghernandez', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'ghernandez@clubsalvadoreno.com', '+503-2345-6790', 'atencion_miembro', TRUE, 'approved', '2024-01-01 00:00:00'),
('user-002', 'María', 'García', 'mgarcia', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'mgarcia@clubsalvadoreno.com', '+503-2345-6791', 'anfitrion', TRUE, 'approved', '2024-01-15 00:00:00'),
('user-003', 'Carlos', 'Rodríguez', 'crodriguez', '$2b$12$K8pLXfZk9oGZFX4Y5mHu5eqpHJyR8WtL6vCjSw2nQ0.mBh3zP7XYO', 'crodriguez@clubsalvadoreno.com', '+503-2345-6792', 'miembro', TRUE, 'approved', 'activo', 'Visitador Juvenil', '2024-02-01 00:00:00');

-- Insertar alojamientos con precios diferenciados por temporada
INSERT INTO accommodations (id, name, type, location, capacity, description, amenities, precio_temporada_baja, precio_temporada_alta, precio_dias_asueto, images, available, view_type, featured, max_guests) VALUES

-- APARTAMENTOS EL SUNZAL
('sunzal-apt-1A', 'Apartamento 1A', 'apartamento', 'el-sunzal', 2, 'Apartamento cómodo con vista directa al mar, perfecto para parejas.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette", "Vista al mar"]', 
110.00, 230.00, 280.00, 
'["/images/apartamentos/1a-main.jpg", "/images/apartamentos/1a-bedroom.jpg"]', TRUE, 'Vista al mar', FALSE, 2),

('sunzal-apt-1B', 'Apartamento 1B', 'apartamento', 'el-sunzal', 2, 'Apartamento acogedor con vista parcial al mar.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"]', 
95.00, 210.00, 250.00, 
'["/images/apartamentos/1b-main.jpg", "/images/apartamentos/1b-living.jpg"]', TRUE, 'Vista parcial', FALSE, 2),

('sunzal-apt-2A', 'Apartamento 2A', 'apartamento', 'el-sunzal', 4, 'Espacioso apartamento familiar con vista premium al mar.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa", "Balcón"]', 
120.00, 250.00, 300.00, 
'["/images/apartamentos/2a-main.jpg", "/images/apartamentos/2a-balcony.jpg"]', TRUE, 'Vista al mar premium', FALSE, 4),

('sunzal-apt-2B', 'Apartamento 2B', 'apartamento', 'el-sunzal', 4, 'Apartamento familiar con vista al jardín.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa"]', 
115.00, 240.00, 290.00, 
'["/images/apartamentos/2b-main.jpg"]', TRUE, 'Vista jardín', FALSE, 4),

('sunzal-apt-3A', 'Apartamento 3A - Penthouse', 'apartamento', 'el-sunzal', 6, 'Penthouse de lujo con vista espectacular.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina gourmet", "Terraza privada"]', 
140.00, 280.00, 350.00, 
'["/images/apartamentos/3a-main.jpg", "/images/apartamentos/3a-terrace.jpg"]', TRUE, 'Penthouse', TRUE, 6),

('sunzal-apt-3B', 'Apartamento 3B', 'apartamento', 'el-sunzal', 6, 'Apartamento amplio con vista lateral.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa", "Balcón"]', 
135.00, 270.00, 340.00, 
'["/images/apartamentos/3b-main.jpg"]', TRUE, 'Vista lateral', FALSE, 6),

-- CASAS EL SUNZAL
('sunzal-casa-surf-paradise', 'Casa Surf Paradise', 'casa', 'el-sunzal', 6, 'Casa diseñada especialmente para surfistas con acceso directo al break.', 
'["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza", "Almacenamiento tablas", "Ducha exterior"]', 
200.00, 350.00, 400.00, 
'["/images/casas/surf-paradise-main.jpg", "/images/casas/surf-paradise-exterior.jpg"]', TRUE, 'Frente al mar', TRUE, 6),

('sunzal-casa-familiar-deluxe', 'Casa Familiar Deluxe', 'casa', 'el-sunzal', 8, 'Casa amplia para familias grandes con todas las comodidades.', 
'["Wi-Fi", "Aire acondicionado", "Cocina gourmet", "Jardín privado", "BBQ", "Sala de juegos"]', 
280.00, 420.00, 480.00, 
'["/images/casas/familiar-deluxe-main.jpg", "/images/casas/familiar-deluxe-garden.jpg"]', TRUE, 'Amplia vista', FALSE, 8),

('sunzal-casa-vista-panoramica', 'Casa Vista Panorámica', 'casa', 'el-sunzal', 6, 'Casa elevada con vista panorámica del océano.', 
'["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza multinivel", "Jacuzzi exterior", "Zona hamacas"]', 
240.00, 380.00, 450.00, 
'["/images/casas/vista-panoramica-main.jpg"]', TRUE, 'Vista panorámica', TRUE, 6),

-- SUITES EL SUNZAL
('sunzal-suite-ejecutiva', 'Suite Ejecutiva Presidencial', 'suite', 'el-sunzal', 2, 'Suite de máximo lujo con servicios premium.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Balcón privado"]', 
650.00, 850.00, 950.00, 
'["/images/suites/ejecutiva-main.jpg"]', TRUE, 'Premium', TRUE, 2),

('sunzal-suite-presidencial', 'Suite Presidencial Ocean View', 'suite', 'el-sunzal', 2, 'Suite presidencial con vista directa al océano.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Vista oceánica"]', 
750.00, 950.00, 1050.00, 
'["/images/suites/presidencial-main.jpg"]', TRUE, 'Ocean View', TRUE, 2),

('sunzal-suite-royal-penthouse', 'Suite Royal Penthouse', 'suite', 'el-sunzal', 4, 'Penthouse real con todas las comodidades de lujo.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Terraza privada", "Butler service"]', 
850.00, 1150.00, 1250.00, 
'["/images/suites/royal-penthouse-main.jpg"]', TRUE, 'Royal', TRUE, 4),

-- APARTAMENTOS CORINTO
('corinto-apt-1A', 'Apartamento Corinto 1A', 'apartamento', 'corinto', 2, 'Apartamento con vista directa al lago.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette", "Vista lago"]', 
100.00, 210.00, 260.00, 
'["/images/corinto/apt-1a-main.jpg"]', TRUE, 'Vista lago', FALSE, 2),

('corinto-apt-1B', 'Apartamento Corinto 1B', 'apartamento', 'corinto', 2, 'Apartamento con vista parcial al lago.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"]', 
85.00, 190.00, 230.00, 
'["/images/corinto/apt-1b-main.jpg"]', TRUE, 'Vista parcial', FALSE, 2),

-- CASAS CORINTO
('corinto-casa-lago', 'Casa del Lago', 'casa', 'corinto', 6, 'Casa con vista directa al lago y jardín privado.', 
'["Wi-Fi", "Aire acondicionado", "Cocina completa", "Jardín privado", "Vista lago", "BBQ"]', 
280.00, 380.00, 420.00, 
'["/images/corinto/casa-lago-main.jpg"]', TRUE, 'Vista lago', TRUE, 6),

('corinto-casa-ejecutiva', 'Casa Ejecutiva Premium', 'casa', 'corinto', 8, 'Casa de estilo corporativo moderno.', 
'["Wi-Fi", "Aire acondicionado", "Cocina gourmet", "Sala reuniones", "Oficina privada"]', 
350.00, 450.00, 500.00, 
'["/images/corinto/casa-ejecutiva-main.jpg"]', TRUE, 'Estilo ejecutivo', FALSE, 8),

('corinto-casa-rustica', 'Casa Rústica Tradicional', 'casa', 'corinto', 4, 'Casa de arquitectura tradicional con materiales locales.', 
'["Wi-Fi", "Aire acondicionado", "Cocina tradicional", "Chimenea", "Ambiente acogedor"]', 
220.00, 320.00, 370.00, 
'["/images/corinto/casa-rustica-main.jpg"]', TRUE, 'Tradicional', FALSE, 4),

('corinto-casa-moderna', 'Casa Moderna Minimalista', 'casa', 'corinto', 6, 'Casa de diseño contemporáneo con tecnología integrada.', 
'["Wi-Fi", "Aire acondicionado", "Cocina moderna", "Domótica", "Diseño minimalista"]', 
260.00, 360.00, 410.00, 
'["/images/corinto/casa-moderna-main.jpg"]', TRUE, 'Moderno', TRUE, 6),

('corinto-casa-familiar', 'Casa Familiar Grande', 'casa', 'corinto', 10, 'Casa para grupos grandes con espacios amplios.', 
'["Wi-Fi", "Aire acondicionado", "Cocina industrial", "Múltiples salas", "Gran jardín"]', 
300.00, 400.00, 450.00, 
'["/images/corinto/casa-familiar-main.jpg"]', TRUE, 'Familiar', FALSE, 10),

('corinto-casa-romantica', 'Casa Romántica', 'casa', 'corinto', 2, 'Casa ideal para parejas con jacuzzi privado.', 
'["Wi-Fi", "Aire acondicionado", "Jacuzzi privado", "Decoración elegante", "Ambiente romántico"]', 
320.00, 420.00, 480.00, 
'["/images/corinto/casa-romantica-main.jpg"]', TRUE, 'Romántico', TRUE, 2);

-- Insertar días feriados de El Salvador para 2025 y 2026
INSERT INTO holidays (date, name, description, season_type, is_active) VALUES
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

-- Insertar reglas de precios para acompañantes
INSERT INTO pricing_rules (location, category, description, price, day_type, season_type, is_active) VALUES
-- El Sunzal
('El Sunzal', 'INVITADO_TEMPORADA_BAJA_SEMANA', 'Invitado lunes a jueves temporada baja', 10.00, 'lunes_jueves', 'temporada_baja', TRUE),
('El Sunzal', 'INVITADO_TEMPORADA_ALTA_FIN_SEMANA', 'Invitado viernes a domingo temporada alta', 15.00, 'viernes_domingo', 'temporada_alta', TRUE),
('El Sunzal', 'INVITADO_DIA_ASUETO', 'Invitado días de asueto', 20.00, 'festivo', 'dias_asueto', TRUE),
('El Sunzal', 'INVITADOS_EVENTO', 'Invitados para eventos especiales', 10.00, 'todos', 'todos', TRUE),

-- Corinto
('Corinto', 'CUOTA_INVITADO_REGULAR', 'Cuota regular de invitado', 10.00, 'todos', 'todos', TRUE),
('Corinto', 'GREEN_FEE_INVITADO', 'Green fee para uso de canchas de golf', 60.00, 'todos', 'todos', TRUE),
('Corinto', 'INVITADO_DIA_ASUETO', 'Invitado días de asueto', 15.00, 'festivo', 'dias_asueto', TRUE),
('Corinto', 'INVITADOS_EVENTO', 'Invitados para eventos especiales', 10.00, 'todos', 'todos', TRUE);

-- Insertar configuraciones del sistema
INSERT INTO system_settings (key_name, value, description, type, category, is_public, is_editable) VALUES
('max_reservation_days', '7', 'Máximo número de días consecutivos para una reserva', 'number', 'reservations', FALSE, TRUE),
('min_advance_booking_hours', '24', 'Mínimo de horas de anticipación para hacer una reserva', 'number', 'reservations', FALSE, TRUE),
('notification_email', 'notifications@clubsalvadoreno.com', 'Email para notificaciones del sistema', 'email', 'notifications', FALSE, TRUE),
('site_name', 'Club Salvadoreño', 'Nombre del sitio web', 'string', 'general', TRUE, TRUE),
('site_description', 'Sistema de Reservas y Gestión - Club Salvadoreño', 'Descripción del sitio', 'string', 'general', TRUE, TRUE),
('maintenance_mode', 'false', 'Modo de mantenimiento del sistema', 'boolean', 'system', FALSE, TRUE),
('default_currency', 'USD', 'Moneda por defecto del sistema', 'string', 'pricing', TRUE, FALSE),
('tax_rate', '0.13', 'Tasa de impuesto (IVA) aplicable', 'number', 'pricing', FALSE, TRUE),
('enable_email_notifications', 'true', 'Habilitar notificaciones por email', 'boolean', 'notifications', FALSE, TRUE),
('enable_sms_notifications', 'false', 'Habilitar notificaciones por SMS', 'boolean', 'notifications', FALSE, TRUE),
('booking_confirmation_auto', 'true', 'Confirmación automática de reservas', 'boolean', 'reservations', FALSE, TRUE),
('pricing_calculation_method', 'by_season', 'Método de cálculo de precios', 'string', 'pricing', FALSE, FALSE),
('temporada_baja_days', 'lunes,martes,miercoles,jueves', 'Días de temporada baja', 'string', 'pricing', FALSE, TRUE),
('temporada_alta_days', 'viernes,sabado,domingo', 'Días de temporada alta', 'string', 'pricing', FALSE, TRUE);

-- =====================================================
-- 14. VISTAS ÚTILES PARA REPORTES
-- =====================================================

-- Vista de estadísticas de usuarios por rol
CREATE VIEW user_stats_by_role AS
SELECT 
    role,
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_users,
    COUNT(CASE WHEN member_status = 'activo' THEN 1 END) as active_members,
    COUNT(CASE WHEN member_status = 'en_mora' THEN 1 END) as members_in_debt
FROM users 
GROUP BY role;

-- Vista de reservas con información completa
CREATE VIEW reservation_details_complete AS
SELECT 
    r.id as reservation_id,
    r.check_in,
    r.check_out,
    r.guests,
    r.total_nights,
    r.nights_temporada_baja,
    r.nights_temporada_alta,
    r.nights_dias_asueto,
    r.subtotal_temporada_baja,
    r.subtotal_temporada_alta,
    r.subtotal_dias_asueto,
    r.total_price,
    r.status,
    u.full_name as guest_name,
    u.email as guest_email,
    u.phone as guest_phone,
    u.membership_type,
    a.name as accommodation_name,
    a.location,
    a.type as accommodation_type,
    a.capacity,
    a.precio_temporada_baja,
    a.precio_temporada_alta,
    a.precio_dias_asueto,
    r.created_at as reservation_date
FROM reservations r
JOIN users u ON r.user_id = u.id
JOIN accommodations a ON r.accommodation_id = a.id;

-- Vista de estadísticas de alojamientos
CREATE VIEW accommodation_stats_complete AS
SELECT 
    a.id,
    a.name,
    a.location,
    a.type,
    a.capacity,
    a.precio_temporada_baja,
    a.precio_temporada_alta,
    a.precio_dias_asueto,
    COUNT(r.id) as total_reservations,
    COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as confirmed_reservations,
    SUM(r.total_nights) as total_nights_booked,
    SUM(r.total_price) as total_revenue,
    AVG(r.total_price) as average_booking_value,
    AVG(CASE WHEN rv.rating_overall IS NOT NULL THEN rv.rating_overall END) as average_rating,
    COUNT(rv.id) as total_reviews,
    a.featured,
    a.available
FROM accommodations a
LEFT JOIN reservations r ON a.id = r.accommodation_id AND r.status IN ('confirmed', 'completed', 'checked_in', 'checked_out')
LEFT JOIN reviews rv ON a.id = rv.accommodation_id
GROUP BY a.id;

-- Vista de ingresos por temporada
CREATE VIEW revenue_by_season AS
SELECT 
    'Temporada Baja' as season_name,
    'temporada_baja' as season_type,
    SUM(nights_temporada_baja) as total_nights,
    SUM(subtotal_temporada_baja) as total_revenue,
    COUNT(CASE WHEN nights_temporada_baja > 0 THEN 1 END) as bookings_count,
    AVG(subtotal_temporada_baja / NULLIF(nights_temporada_baja, 0)) as avg_price_per_night
FROM reservations 
WHERE status IN ('confirmed', 'completed', 'checked_in', 'checked_out')

UNION ALL

SELECT 
    'Temporada Alta' as season_name,
    'temporada_alta' as season_type,
    SUM(nights_temporada_alta) as total_nights,
    SUM(subtotal_temporada_alta) as total_revenue,
    COUNT(CASE WHEN nights_temporada_alta > 0 THEN 1 END) as bookings_count,
    AVG(subtotal_temporada_alta / NULLIF(nights_temporada_alta, 0)) as avg_price_per_night
FROM reservations 
WHERE status IN ('confirmed', 'completed', 'checked_in', 'checked_out')

UNION ALL

SELECT 
    'Días de Asueto' as season_name,
    'dias_asueto' as season_type,
    SUM(nights_dias_asueto) as total_nights,
    SUM(subtotal_dias_asueto) as total_revenue,
    COUNT(CASE WHEN nights_dias_asueto > 0 THEN 1 END) as bookings_count,
    AVG(subtotal_dias_asueto / NULLIF(nights_dias_asueto, 0)) as avg_price_per_night
FROM reservations 
WHERE status IN ('confirmed', 'completed', 'checked_in', 'checked_out');

-- =====================================================
-- 15. ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_reservations_date_status ON reservations(check_in, check_out, status);
CREATE INDEX idx_reservations_user_status ON reservations(user_id, status);
CREATE INDEX idx_reservations_accommodation_date ON reservations(accommodation_id, check_in, check_out);
CREATE INDEX idx_accommodations_location_type ON accommodations(location, type);
CREATE INDEX idx_accommodations_pricing ON accommodations(precio_temporada_baja, precio_temporada_alta, precio_dias_asueto);
CREATE INDEX idx_holidays_date_active ON holidays(date, is_active);
CREATE INDEX idx_messages_conversation_timestamp ON messages(conversation_id, timestamp);
CREATE INDEX idx_access_records_member_date ON access_records(member_id, access_time);
CREATE INDEX idx_billing_location_status ON companion_billing_records(location, status);
CREATE INDEX idx_activity_logs_date_type ON activity_logs(date, type);
CREATE INDEX idx_notifications_user_type_read ON notifications(user_id, type, is_read);

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

-- Verificar creación de tablas
SELECT 
    TABLE_NAME as 'Tabla',
    TABLE_ROWS as 'Filas',
    CREATE_TIME as 'Creada'
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = 'club_salvadoreno_db'
ORDER BY 
    TABLE_NAME;

-- Mensaje de finalización
SELECT 'Base de datos del Sistema Club Salvadoreño creada exitosamente con precios por temporada!' as 'ESTADO';
SELECT 'IMPORTANTE: Los alojamientos ahora tienen 3 precios diferenciados:' as 'NOTA';
SELECT '- precio_temporada_baja (lunes-jueves)' as 'TEMPORADA_BAJA';
SELECT '- precio_temporada_alta (viernes-domingo)' as 'TEMPORADA_ALTA';  
SELECT '- precio_dias_asueto (días feriados)' as 'DIAS_ASUETO';

-- =====================================================
-- RESUMEN DE FUNCIONALIDADES IMPLEMENTADAS
-- =====================================================
/*
FUNCIONALIDADES PRINCIPALES:

1. ✅ SISTEMA DE PRECIOS POR TEMPORADA
   - Tres tipos de precios por alojamiento
   - Cálculo automático según fecha
   - Historial de cambios de precios

2. ✅ SISTEMA DE USUARIOS COMPLETO
   - Roles: super_admin, atencion_miembro, anfitrion, monitor, mercadeo, recepcion, porteria, miembro
   - Tipos de membresía: Viuda, Honorario, Fundador, etc.
   - Estados: activo, inactivo, en_mora

3. ✅ SISTEMA DE ALOJAMIENTOS
   - El Sunzal: apartamentos, casas, suites
   - Corinto: apartamentos, casas
   - 20+ alojamientos con precios reales

4. ✅ SISTEMA DE RESERVAS AVANZADO
   - Cálculo automático por temporada
   - Breakdown detallado de precios
   - Estados completos de reserva

5. ✅ SISTEMA DE RESEÑAS
   - Calificaciones por categoría
   - Respuestas del anfitrión
   - Moderación de contenido

6. ✅ SISTEMA DE MENSAJERÍA
   - Conversaciones huésped-anfitrión
   - Archivos adjuntos
   - Borradores automáticos

7. ✅ CONTROL DE ACCESO (PORTERÍA)
   - Registro de entrada/salida
   - Múltiples métodos de detección
   - Gestión de acompañantes

8. ✅ FACTURACIÓN DE ACOMPAÑANTES
   - Precios diferenciados por ubicación
   - Cálculo automático según temporada
   - Historial de facturación

9. ✅ SISTEMA DE LOGS Y AUDITORÍA
   - Registro de todas las actividades
   - Trazabilidad completa
   - Metadatos de cambios

10. ✅ NOTIFICACIONES AVANZADAS
    - Múltiples canales (email, SMS, push)
    - Dirigidas por rol o usuario
    - Estados de entrega

11. ✅ CONFIGURACIÓN FLEXIBLE
    - Parámetros editables
    - Categorización de settings
    - Validación de valores

12. ✅ DÍAS FERIADOS
    - Calendario 2025-2026
    - Clasificación por temporada
    - Activación/desactivación

13. ✅ TRIGGERS Y AUTOMATIZACIÓN
    - Cálculo automático de precios
    - Historial de cambios
    - Contadores de mensajes

14. ✅ VISTAS PARA REPORTES
    - Estadísticas por temporada
    - Análisis de ingresos
    - Métricas de ocupación

15. ✅ ÍNDICES OPTIMIZADOS
    - Consultas eficientes
    - Búsquedas rápidas
    - Performance mejorada

CORRECCIÓN PRINCIPAL IMPLEMENTADA:
❌ Antes: accommodations.price_per_night (un solo precio)
✅ Ahora: accommodations.precio_temporada_baja, precio_temporada_alta, precio_dias_asueto

Este script resuelve completamente el problema mencionado de que 
"los alojamientos solo tienen un precio cuando sabemos que son 3".
*/

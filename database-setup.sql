-- =====================================================
-- SISTEMA CLUB SALVADOREÑO - SCRIPT DE BASE DE DATOS
-- =====================================================
-- Incluye tanto el sistema de reservas para miembros
-- como el sistema de backoffice administrativo
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS club_salvadoreno_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

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

-- =====================================================
-- 2. SISTEMA DE ALOJAMIENTOS
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
    pricing_weekday DECIMAL(10,2) NOT NULL,
    pricing_weekend DECIMAL(10,2) NOT NULL,
    pricing_holiday DECIMAL(10,2) NOT NULL,
    images JSON, -- Array de URLs de imágenes
    available BOOLEAN DEFAULT TRUE,
    view_type VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_location (location),
    INDEX idx_type (type),
    INDEX idx_capacity (capacity),
    INDEX idx_available (available),
    INDEX idx_featured (featured)
);

-- =====================================================
-- 3. SISTEMA DE RESERVAS
-- =====================================================

-- Tabla de reservas
CREATE TABLE reservations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    accommodation_id VARCHAR(50) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Breakdown de precios
    weekday_days INT DEFAULT 0,
    weekend_days INT DEFAULT 0,
    holiday_days INT DEFAULT 0,
    weekday_total DECIMAL(10,2) DEFAULT 0,
    weekend_total DECIMAL(10,2) DEFAULT 0,
    holiday_total DECIMAL(10,2) DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_accommodation_id (accommodation_id),
    INDEX idx_check_in (check_in),
    INDEX idx_check_out (check_out),
    INDEX idx_status (status),
    INDEX idx_dates (check_in, check_out)
);

-- =====================================================
-- 4. SISTEMA DE RESEÑAS
-- =====================================================

-- Tabla de reseñas
CREATE TABLE reviews (
    id VARCHAR(50) PRIMARY KEY,
    accommodation_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    reservation_id VARCHAR(50) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    images JSON, -- Array de URLs de imágenes
    
    -- Categorías de calificación
    cleanliness INT CHECK (cleanliness >= 1 AND cleanliness <= 5),
    communication INT CHECK (communication >= 1 AND communication <= 5),
    checkin INT CHECK (checkin >= 1 AND checkin <= 5),
    accuracy INT CHECK (accuracy >= 1 AND accuracy <= 5),
    location_rating INT CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
    
    helpful_count INT DEFAULT 0,
    reported_count INT DEFAULT 0,
    is_moderated BOOLEAN DEFAULT FALSE,
    moderator_note TEXT,
    
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
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 5. SISTEMA DE MENSAJERÍA
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
    
    -- Metadatos
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
    INDEX idx_status (status)
);

-- Tabla de mensajes
CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    sender_name VARCHAR(200),
    sender_role ENUM('guest', 'host', 'admin') NOT NULL,
    content TEXT NOT NULL,
    type ENUM('text', 'image', 'document', 'system') DEFAULT 'text',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    
    -- Metadatos
    reservation_id VARCHAR(50),
    accommodation_id VARCHAR(50),
    urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
    category ENUM('booking', 'payment', 'support', 'general') DEFAULT 'general',
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_read_status (read_status)
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
    
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    INDEX idx_message_id (message_id)
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
-- 6. SISTEMA DE CONTROL DE ACCESO (PORTERÍA)
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
    location VARCHAR(100) DEFAULT 'Entrada Principal',
    companions_count INT DEFAULT 0,
    detection_method ENUM('card', 'manual', 'qr', 'face') NOT NULL,
    gate_keeper_name VARCHAR(200) NOT NULL,
    gate_keeper_id VARCHAR(50) NOT NULL,
    notes TEXT,
    status ENUM('active', 'completed') DEFAULT 'active',
    
    FOREIGN KEY (member_id) REFERENCES users(id),
    FOREIGN KEY (gate_keeper_id) REFERENCES users(id),
    INDEX idx_member_id (member_id),
    INDEX idx_access_time (access_time),
    INDEX idx_status (status),
    INDEX idx_location (location)
);

-- =====================================================
-- 7. SISTEMA DE FACTURACIÓN DE ACOMPAÑANTES
-- =====================================================

-- Tabla de reglas de precios
CREATE TABLE pricing_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location ENUM('El Sunzal', 'Corinto') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(300) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (location),
    INDEX idx_category (category),
    INDEX idx_active (is_active)
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
    status ENUM('pending', 'processed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    processed_at TIMESTAMP NULL,
    processed_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (access_record_id) REFERENCES access_records(id),
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_access_record_id (access_record_id),
    INDEX idx_status (status),
    INDEX idx_access_time (access_time),
    INDEX idx_location (location)
);

-- Tabla de items de facturación
CREATE TABLE billing_items (
    id VARCHAR(50) PRIMARY KEY,
    billing_record_id VARCHAR(50) NOT NULL,
    description VARCHAR(300) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    location VARCHAR(100),
    category VARCHAR(100),
    
    FOREIGN KEY (billing_record_id) REFERENCES companion_billing_records(id) ON DELETE CASCADE,
    INDEX idx_billing_record_id (billing_record_id)
);

-- =====================================================
-- 8. SISTEMA DE LOGS DE ACTIVIDAD
-- =====================================================

-- Tabla de logs de actividad administrativa
CREATE TABLE activity_logs (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    type ENUM('check_in', 'check_out', 'maintenance', 'cleaning', 'inspection') NOT NULL,
    location ENUM('el-sunzal', 'corinto') NOT NULL,
    accommodation_id VARCHAR(50),
    description VARCHAR(500) NOT NULL,
    details TEXT,
    user_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_location (location),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- 9. SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tabla de notificaciones
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('reservation', 'user_registration', 'system', 'review', 'access', 'billing') NOT NULL,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSON, -- Datos adicionales específicos del tipo de notificación
    
    -- Para dirigir notificaciones a usuarios específicos
    user_id VARCHAR(50),
    role ENUM('super_admin', 'atencion_miembro', 'anfitrion', 'monitor', 'mercadeo', 'recepcion', 'porteria'),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 10. SISTEMA DE CONFIGURACIÓN
-- =====================================================

-- Tabla de configuraciones del sistema
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    updated_by VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_category (category),
    INDEX idx_key_name (key_name)
);

-- Tabla de días feriados
CREATE TABLE holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    year INT GENERATED ALWAYS AS (YEAR(date)) STORED,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_date (date),
    INDEX idx_year (year),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 11. TRIGGERS Y PROCEDIMIENTOS ALMACENADOS
-- =====================================================

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

-- Trigger para marcar mensajes como leídos
DELIMITER //
CREATE TRIGGER update_conversation_read_count 
AFTER UPDATE ON messages
FOR EACH ROW
BEGIN
    IF OLD.read_status = FALSE AND NEW.read_status = TRUE THEN
        IF NEW.sender_role = 'guest' THEN
            UPDATE conversations 
            SET unread_count_host = GREATEST(0, unread_count_host - 1)
            WHERE id = NEW.conversation_id;
        ELSE
            UPDATE conversations 
            SET unread_count_guest = GREATEST(0, unread_count_guest - 1)
            WHERE id = NEW.conversation_id;
        END IF;
    END IF;
END//
DELIMITER ;

-- Procedimiento para obtener estadísticas de reservas
DELIMITER //
CREATE PROCEDURE GetReservationStats(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        COUNT(*) as total_reservations,
        SUM(total_price) as total_revenue,
        AVG(total_price) as average_price,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count
    FROM reservations 
    WHERE check_in BETWEEN start_date AND end_date;
END//
DELIMITER ;

-- =====================================================
-- 12. INSERCIÓN DE DATOS INICIALES
-- =====================================================

-- Insertar usuarios administrativos
INSERT INTO users (id, first_name, last_name, username, password, email, phone, role, is_active, status, created_at) VALUES
('1', 'Super', 'Administrador', 'superadmin', 'SuperAdmin123', 'superadmin@clubsalvadoreno.com', '+503 2345-6789', 'super_admin', TRUE, 'approved', '2024-01-01 00:00:00'),
('2', 'Ana', 'García', 'atencion', 'Atencion123', 'atencion@clubsalvadoreno.com', '+503 2345-6790', 'atencion_miembro', TRUE, 'approved', '2024-01-01 00:00:00'),
('3', 'Carlos', 'Rodríguez', 'anfitrion', 'Anfitrion123', 'carlos.rodriguez@email.com', '+503 2345-6791', 'anfitrion', TRUE, 'approved', '2024-01-15 00:00:00'),
('4', 'David', 'López', 'monitor', 'Monitor123', 'monitor@clubsalvadoreno.com', '+503 2345-6792', 'monitor', TRUE, 'approved', '2024-01-15 00:00:00'),
('5', 'Elena', 'Martínez', 'mercadeo', 'Mercadeo123', 'mercadeo@clubsalvadoreno.com', '+503 2345-6793', 'mercadeo', TRUE, 'approved', '2024-01-15 00:00:00'),
('11', 'Sofia', 'Herrera', 'recepcion', 'Recepcion123', 'recepcion@clubsalvadoreno.com', '+503 2345-6794', 'recepcion', TRUE, 'approved', '2024-01-15 00:00:00'),
('12', 'Roberto', 'Portillo', 'portero', 'Portero123', 'portero@clubsalvadoreno.com', '+503 7890-1234', 'porteria', TRUE, 'approved', '2024-01-01 09:00:00');

-- Insertar miembros del club
INSERT INTO users (id, first_name, last_name, username, password, email, phone, role, is_active, status, member_status, membership_type, created_at) VALUES
('6', 'María José', 'González', 'usuario1', 'Usuario123', 'usuario1@email.com', '+503 7234-5678', 'miembro', TRUE, 'approved', 'activo', 'Contribuyente', '2024-02-01 00:00:00'),
('7', 'Carlos', 'Rivera', 'carlos.rivera', 'Carlos2024', 'carlos.rivera@email.com', '+503 7234-5679', 'miembro', TRUE, 'approved', 'activo', 'Fundador', '2024-02-10 00:00:00'),
('8', 'Ana', 'Martínez', 'ana.martinez', 'Ana123456', 'ana.martinez@email.com', '+503 7234-5680', 'miembro', TRUE, 'approved', 'en_mora', 'Honorario', '2024-02-15 00:00:00'),
('9', 'Juan', 'Pérez', 'jperez', 'JuanP123', 'juan.perez@email.com', '+503 7234-5681', 'miembro', FALSE, 'approved', 'inactivo', NULL, '2024-03-01 00:00:00'),
('10', 'Demo', 'Usuario', 'demo', 'demo123', 'demo@clubsalvadoreno.com', '+503 7234-5682', 'miembro', TRUE, 'approved', 'activo', NULL, '2024-01-01 00:00:00');

-- Insertar alojamientos de El Sunzal
INSERT INTO accommodations (id, name, type, location, capacity, description, amenities, pricing_weekday, pricing_weekend, pricing_holiday, images, available, view_type, featured, created_at) VALUES
-- Apartamentos El Sunzal
('1A', 'Apartamento 1A', 'apartamento', 'el-sunzal', 2, 'Cómodo apartamento con vista directa al mar, perfecto para parejas. Ubicado en el primer piso con fácil acceso y todas las comodidades necesarias.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette", "Vista al mar"]', 110.00, 230.00, 280.00, 
'["/api/images/apartamentos/1a-main.jpg", "/api/images/apartamentos/1a-bedroom.jpg"]', TRUE, 'Vista al mar', FALSE, NOW()),

('1B', 'Apartamento 1B', 'apartamento', 'el-sunzal', 2, 'Apartamento acogedor con vista parcial al mar. Ideal para una estancia romántica con todas las comodidades modernas.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"]', 95.00, 210.00, 260.00, 
'["/api/images/apartamentos/1b-main.jpg", "/api/images/apartamentos/1b-living.jpg"]', TRUE, 'Vista parcial', FALSE, NOW()),

('2A', 'Apartamento 2A', 'apartamento', 'el-sunzal', 4, 'Espacioso apartamento para familias con vista premium al mar. Segundo piso con balcón privado y cocina completa.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa", "Balcón"]', 120.00, 250.00, 300.00, 
'["/api/images/apartamentos/2a-main.jpg", "/api/images/apartamentos/2a-balcony.jpg"]', TRUE, 'Vista al mar premium', FALSE, NOW()),

-- Casas El Sunzal
('casa-surf-paradise', 'Casa Surf Paradise', 'casa', 'el-sunzal', 6, 'Casa diseñada especialmente para surfistas con acceso directo al break. Incluye almacenamiento para tablas y ducha exterior.', 
'["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza", "Almacenamiento para tablas", "Ducha exterior"]', 250.00, 450.00, 550.00, 
'["/api/images/casas/surf-paradise-main.jpg", "/api/images/casas/surf-paradise-exterior.jpg"]', TRUE, 'Frente al mar', TRUE, NOW()),

('casa-familiar-deluxe', 'Casa Familiar Deluxe', 'casa', 'el-sunzal', 8, 'Casa amplia y familiar con todas las comodidades para grupos grandes. Jardín privado, BBQ y sala de juegos incluidos.', 
'["Wi-Fi", "Aire acondicionado", "Cocina gourmet", "Jardín privado", "BBQ", "Sala de juegos"]', 300.00, 550.00, 650.00, 
'["/api/images/casas/familiar-deluxe-main.jpg", "/api/images/casas/familiar-deluxe-garden.jpg"]', TRUE, 'Amplia vista', FALSE, NOW());

-- Insertar algunas suites premium de El Sunzal
INSERT INTO accommodations (id, name, type, location, capacity, description, amenities, pricing_weekday, pricing_weekend, pricing_holiday, images, available, view_type, featured, created_at) VALUES
('suite-1', 'Suite Premium 1', 'suite', 'el-sunzal', 2, 'Suite de lujo número 1 con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Balcón privado"]', 180.00, 320.00, 420.00, 
'["/api/images/suites/suite-1-main.jpg", "/api/images/suites/suite-1-view.jpg"]', TRUE, 'Premium', TRUE, NOW()),

('suite-2', 'Suite Premium 2', 'suite', 'el-sunzal', 3, 'Suite de lujo número 2 con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Balcón privado"]', 190.00, 335.00, 440.00, 
'["/api/images/suites/suite-2-main.jpg", "/api/images/suites/suite-2-view.jpg"]', TRUE, 'Premium', TRUE, NOW());

-- Insertar alojamientos de Corinto
INSERT INTO accommodations (id, name, type, location, capacity, description, amenities, pricing_weekday, pricing_weekend, pricing_holiday, images, available, view_type, featured, created_at) VALUES
('corinto-casa-1', 'Casa Corinto 1', 'casa', 'corinto', 4, 'Casa moderna 1 en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina equipada", "Terraza", "Jardín", "BBQ"]', 140.00, 280.00, 350.00, 
'["/api/images/corinto/casa-1-main.jpg", "/api/images/corinto/casa-1-lake.jpg"]', TRUE, 'Vista lago', TRUE, NOW()),

('corinto-casa-2', 'Casa Corinto 2', 'casa', 'corinto', 4, 'Casa moderna 2 en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina equipada", "Terraza", "Jardín", "BBQ"]', 155.00, 305.00, 380.00, 
'["/api/images/corinto/casa-2-main.jpg", "/api/images/corinto/casa-2-lake.jpg"]', TRUE, 'Vista lago', FALSE, NOW());

-- Insertar reglas de precios para acompañantes
INSERT INTO pricing_rules (location, category, description, price, is_active) VALUES
-- El Sunzal
('El Sunzal', 'INVITADO DIA FESTIVO TEMP ALTA', 'COBRO INVITADO DIA FESTIVO TEMP ALTA', 20.00, TRUE),
('El Sunzal', 'INVITADOS EVENTO', 'INVITADOS EVENTO', 10.00, TRUE),
('El Sunzal', 'INVITADO LUNES-SABADO TEMP BAJA', 'INVITADO LUNES-SABADO TEMP BAJA', 10.00, TRUE),
('El Sunzal', 'INVITADO DOMINGO TEMP BAJA', 'INVITADO DOMINGO TEMP BAJA', 15.00, TRUE),
('El Sunzal', 'INVITADO DIA FESTIVO TEMP BAJA', 'INVITADO DIA FESTIVO TEMP BAJA', 20.00, TRUE),
-- Corinto
('Corinto', 'CUOTA INVITADO', 'CUOTA INVITADO', 10.00, TRUE),
('Corinto', 'GF INVITADO SOCIO', 'GREEN FREE (Uso de las canchas de golf)', 60.00, TRUE),
('Corinto', 'INVITADOS EVENTO', 'INVITADOS EVENTO', 10.00, TRUE);

-- Insertar días feriados de El Salvador para 2025 y 2026
INSERT INTO holidays (date, name, description) VALUES
-- 2025
('2025-01-01', 'Año Nuevo', 'Celebración del Año Nuevo'),
('2025-03-28', 'Jueves Santo', 'Semana Santa'),
('2025-03-29', 'Viernes Santo', 'Semana Santa'),
('2025-03-30', 'Sábado Santo', 'Semana Santa'),
('2025-05-01', 'Día del Trabajo', 'Día Internacional del Trabajador'),
('2025-05-10', 'Día de la Madre', 'Celebración del Día de la Madre'),
('2025-06-17', 'Día del Padre', 'Celebración del Día del Padre'),
('2025-08-06', 'Día del Salvador del Mundo', 'Festividades Patronales de San Salvador'),
('2025-09-15', 'Día de la Independencia', 'Independencia de El Salvador'),
('2025-11-02', 'Día de los Difuntos', 'Día de los Fieles Difuntos'),
('2025-12-25', 'Navidad', 'Celebración de la Navidad'),

-- 2026
('2026-01-01', 'Año Nuevo', 'Celebración del Año Nuevo'),
('2026-04-17', 'Jueves Santo', 'Semana Santa'),
('2026-04-18', 'Viernes Santo', 'Semana Santa'),
('2026-04-19', 'Sábado Santo', 'Semana Santa'),
('2026-05-01', 'Día del Trabajo', 'Día Internacional del Trabajador'),
('2026-05-10', 'Día de la Madre', 'Celebración del Día de la Madre'),
('2026-06-17', 'Día del Padre', 'Celebración del Día del Padre'),
('2026-08-06', 'Día del Salvador del Mundo', 'Festividades Patronales de San Salvador'),
('2026-09-15', 'Día de la Independencia', 'Independencia de El Salvador'),
('2026-11-02', 'Día de los Difuntos', 'Día de los Fieles Difuntos'),
('2026-12-25', 'Navidad', 'Celebración de la Navidad');

-- Insertar configuraciones del sistema
INSERT INTO system_settings (key_name, value, description, type, category) VALUES
('max_reservation_days', '7', 'Máximo número de días consecutivos para una reserva', 'number', 'reservations'),
('min_advance_booking_hours', '24', 'Mínimo de horas de anticipación para hacer una reserva', 'number', 'reservations'),
('notification_email', 'notifications@clubsalvadoreno.com', 'Email para notificaciones del sistema', 'string', 'notifications'),
('site_name', 'Club Salvadoreño', 'Nombre del sitio web', 'string', 'general'),
('maintenance_mode', 'false', 'Modo de mantenimiento del sistema', 'boolean', 'system');

-- =====================================================
-- 13. VISTAS ÚTILES
-- =====================================================

-- Vista de estadísticas de usuarios
CREATE VIEW user_stats AS
SELECT 
    role,
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_users
FROM users 
GROUP BY role;

-- Vista de reservas con información completa
CREATE VIEW reservation_details AS
SELECT 
    r.id,
    r.check_in,
    r.check_out,
    r.guests,
    r.total_price,
    r.status,
    u.full_name as guest_name,
    u.email as guest_email,
    a.name as accommodation_name,
    a.location,
    a.type as accommodation_type,
    DATEDIFF(r.check_out, r.check_in) as nights
FROM reservations r
JOIN users u ON r.user_id = u.id
JOIN accommodations a ON r.accommodation_id = a.id;

-- Vista de estadísticas de alojamientos
CREATE VIEW accommodation_stats AS
SELECT 
    a.id,
    a.name,
    a.location,
    a.type,
    COUNT(r.id) as total_reservations,
    AVG(CASE WHEN rv.rating IS NOT NULL THEN rv.rating END) as average_rating,
    COUNT(rv.id) as total_reviews,
    SUM(r.total_price) as total_revenue
FROM accommodations a
LEFT JOIN reservations r ON a.id = r.accommodation_id
LEFT JOIN reviews rv ON a.id = rv.accommodation_id
GROUP BY a.id;

-- =====================================================
-- 14. ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_reservations_date_status ON reservations(check_in, check_out, status);
CREATE INDEX idx_reservations_user_status ON reservations(user_id, status);
CREATE INDEX idx_messages_conversation_timestamp ON messages(conversation_id, timestamp);
CREATE INDEX idx_access_records_member_date ON access_records(member_id, access_time);
CREATE INDEX idx_billing_location_status ON companion_billing_records(location, status);

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

-- Este script crea una base de datos completa para el Sistema Club Salvadoreño
-- que incluye tanto el sistema de reservas para miembros como el backoffice administrativo.
--
-- Características principales:
-- 1. Sistema completo de usuarios con roles y permisos
-- 2. Gestión de alojamientos en El Sunzal y Corinto
-- 3. Sistema de reservas con cálculo de precios por tipo de día
-- 4. Sistema de reseñas y calificaciones
-- 5. Sistema de mensajería entre huéspedes y anfitriones
-- 6. Control de acceso y portería con múltiples métodos de detección
-- 7. Facturación automática de acompañantes
-- 8. Logs de actividad administrativa
-- 9. Sistema de notificaciones
-- 10. Configuración flexible del sistema
-- 11. Triggers y procedimientos para automatización
-- 12. Vistas para reportes y estadísticas
--
-- Para usar este script:
-- 1. Ejecutar en un servidor MySQL 8.0 o superior
-- 2. Ajustar los datos iniciales según necesidades específicas
-- 3. Configurar conexiones desde la aplicación
-- 4. Implementar backup y recovery procedures
-- 5. Configurar monitoring y alertas

SELECT 'Base de datos del Sistema Club Salvadoreño creada exitosamente!' as status;

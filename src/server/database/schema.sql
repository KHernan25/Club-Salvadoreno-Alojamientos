-- =====================================================
-- SISTEMA CLUB SALVADOREÑO - SCHEMA SQLITE
-- =====================================================

-- =====================================================
-- 1. SISTEMA DE USUARIOS Y AUTENTICACIÓN
-- =====================================================

-- Tabla de usuarios principales
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    role TEXT NOT NULL DEFAULT 'miembro' CHECK (role IN (
        'super_admin',
        'atencion_miembro', 
        'anfitrion',
        'monitor',
        'mercadeo',
        'recepcion',
        'porteria',
        'miembro'
    )),
    is_active BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    member_status TEXT DEFAULT 'activo' CHECK (member_status IN ('activo', 'inactivo', 'en_mora')),
    membership_type TEXT CHECK (membership_type IN (
        'Viuda',
        'Honorario', 
        'Fundador',
        'Visitador Transeunte',
        'Visitador Especial',
        'Visitador Juvenil',
        'Contribuyente'
    )),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    profile_image TEXT
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_member_status ON users(member_status);

-- Tabla de documentos de usuarios
CREATE TABLE IF NOT EXISTS user_documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    id_document TEXT,
    member_card TEXT,
    face_photo TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);

-- Tabla de solicitudes de registro
CREATE TABLE IF NOT EXISTS registration_requests (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    document_type TEXT NOT NULL CHECK (document_type IN ('dui', 'passport')),
    document_number TEXT NOT NULL,
    member_code TEXT NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by TEXT,
    rejection_reason TEXT,
    notes TEXT,
    
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_registration_requests_status ON registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_registration_requests_submitted_at ON registration_requests(submitted_at);

-- Tabla de tokens de reseteo de contraseña
CRETE TABLE IF NOT EXISTS password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- =====================================================
-- 2. SISTEMA DE ALOJAMIENTOS
-- =====================================================

-- Tabla de alojamientos
CREATE TABLE IF NOT EXISTS accommodations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('apartamento', 'casa', 'suite')),
    location TEXT NOT NULL CHECK (location IN ('el-sunzal', 'corinto')),
    capacity INTEGER NOT NULL,
    description TEXT,
    amenities TEXT, -- JSON array
    pricing_weekday DECIMAL(10,2) NOT NULL,
    pricing_weekend DECIMAL(10,2) NOT NULL,
    pricing_holiday DECIMAL(10,2) NOT NULL,
    images TEXT, -- JSON array
    available BOOLEAN DEFAULT TRUE,
    view_type TEXT,
    featured BOOLEAN DEFAULT FALSE,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_accommodations_location ON accommodations(location);
CREATE INDEX IF NOT EXISTS idx_accommodations_type ON accommodations(type);
CREATE INDEX IF NOT EXISTS idx_accommodations_capacity ON accommodations(capacity);
CREATE INDEX IF NOT EXISTS idx_accommodations_available ON accommodations(available);
CREATE INDEX IF NOT EXISTS idx_accommodations_featured ON accommodations(featured);

-- =====================================================
-- 3. SISTEMA DE RESERVAS
-- =====================================================

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    accommodation_id TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Breakdown de precios
    weekday_days INTEGER DEFAULT 0,
    weekend_days INTEGER DEFAULT 0,
    holiday_days INTEGER DEFAULT 0,
    weekday_total DECIMAL(10,2) DEFAULT 0,
    weekend_total DECIMAL(10,2) DEFAULT 0,
    holiday_total DECIMAL(10,2) DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_accommodation_id ON reservations(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservations(check_out);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in, check_out);

-- =====================================================
-- 4. SISTEMA DE RESEÑAS
-- =====================================================

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    accommodation_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    reservation_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    images TEXT, -- JSON array
    
    -- Categorías de calificación
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    checkin INTEGER CHECK (checkin >= 1 AND checkin <= 5),
    accuracy INTEGER CHECK (accuracy >= 1 AND accuracy <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    is_moderated BOOLEAN DEFAULT FALSE,
    moderator_note TEXT,
    
    -- Respuesta del anfitrión
    host_response_message TEXT,
    host_response_created_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_accommodation_id ON reviews(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- =====================================================
-- 5. SISTEMA DE CONTROL DE ACCESO (PORTERÍA)
-- =====================================================

-- Tabla de registros de acceso
CREATE TABLE IF NOT EXISTS access_records (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    member_code TEXT NOT NULL,
    member_photo TEXT,
    membership_type TEXT,
    access_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    location TEXT DEFAULT 'Entrada Principal',
    companions_count INTEGER DEFAULT 0,
    detection_method TEXT NOT NULL CHECK (detection_method IN ('card', 'manual', 'qr', 'face')),
    gate_keeper_name TEXT NOT NULL,
    gate_keeper_id TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    
    FOREIGN KEY (member_id) REFERENCES users(id),
    FOREIGN KEY (gate_keeper_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_access_records_member_id ON access_records(member_id);
CREATE INDEX IF NOT EXISTS idx_access_records_access_time ON access_records(access_time);
CREATE INDEX IF NOT EXISTS idx_access_records_status ON access_records(status);
CREATE INDEX IF NOT EXISTS idx_access_records_location ON access_records(location);

-- =====================================================
-- 6. SISTEMA DE FACTURACIÓN DE ACOMPAÑANTES
-- =====================================================

-- Tabla de reglas de precios
CREATE TABLE IF NOT EXISTS pricing_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL CHECK (location IN ('El Sunzal', 'Corinto')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pricing_rules_location ON pricing_rules(location);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_category ON pricing_rules(category);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules(is_active);

-- Tabla de registros de facturación de acompañantes
CREATE TABLE IF NOT EXISTS companion_billing_records (
    id TEXT PRIMARY KEY,
    access_record_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    member_code TEXT NOT NULL,
    membership_type TEXT,
    location TEXT NOT NULL CHECK (location IN ('El Sunzal', 'Corinto')),
    companions_count INTEGER NOT NULL,
    access_time DATETIME NOT NULL,
    gate_keeper_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    processed_at DATETIME,
    processed_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (access_record_id) REFERENCES access_records(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_companion_billing_access_record_id ON companion_billing_records(access_record_id);
CREATE INDEX IF NOT EXISTS idx_companion_billing_status ON companion_billing_records(status);
CREATE INDEX IF NOT EXISTS idx_companion_billing_access_time ON companion_billing_records(access_time);
CREATE INDEX IF NOT EXISTS idx_companion_billing_location ON companion_billing_records(location);

-- Tabla de items de facturación
CREATE TABLE IF NOT EXISTS billing_items (
    id TEXT PRIMARY KEY,
    billing_record_id TEXT NOT NULL,
    description TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    location TEXT,
    category TEXT,
    
    FOREIGN KEY (billing_record_id) REFERENCES companion_billing_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_billing_items_billing_record_id ON billing_items(billing_record_id);

-- =====================================================
-- 7. SISTEMA DE LOGS DE ACTIVIDAD
-- =====================================================

-- Tabla de logs de actividad administrativa
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('check_in', 'check_out', 'maintenance', 'cleaning', 'inspection')),
    location TEXT NOT NULL CHECK (location IN ('el-sunzal', 'corinto')),
    accommodation_id TEXT,
    description TEXT NOT NULL,
    details TEXT,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_location ON activity_logs(location);
CREATE INDEX IF NOT EXISTS idx_activity_logs_status ON activity_logs(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- =====================================================
-- 8. SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('reservation', 'user_registration', 'system', 'review', 'access', 'billing')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data TEXT, -- JSON data
    
    -- Para dirigir notificaciones a usuarios específicos
    user_id TEXT,
    role TEXT CHECK (role IN ('super_admin', 'atencion_miembro', 'anfitrion', 'monitor', 'mercadeo', 'recepcion', 'porteria')),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(role);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- 9. SISTEMA DE CONFIGURACIÓN
-- =====================================================

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_name TEXT UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type TEXT DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    category TEXT DEFAULT 'general',
    updated_by TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_key_name ON system_settings(key_name);

-- Tabla de días feriados
CREATE TABLE IF NOT EXISTS holidays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    year INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_holidays_year ON holidays(year);
CREATE INDEX IF NOT EXISTS idx_holidays_active ON holidays(is_active);

-- =====================================================
-- 10. TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at en users
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en accommodations  
CREATE TRIGGER IF NOT EXISTS update_accommodations_updated_at 
    AFTER UPDATE ON accommodations
BEGIN
    UPDATE accommodations SET last_updated = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en reservations
CREATE TRIGGER IF NOT EXISTS update_reservations_updated_at 
    AFTER UPDATE ON reservations
BEGIN
    UPDATE reservations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en activity_logs
CREATE TRIGGER IF NOT EXISTS update_activity_logs_updated_at 
    AFTER UPDATE ON activity_logs
BEGIN
    UPDATE activity_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para calcular el año en holidays
CREATE TRIGGER IF NOT EXISTS update_holidays_year 
    AFTER INSERT ON holidays
BEGIN
    UPDATE holidays SET year = CAST(strftime('%Y', NEW.date) AS INTEGER) WHERE id = NEW.id;
END;

-- =====================================================
-- SCHEMA COMPLETADO
-- =====================================================

-- El schema SQLite está optimizado para el desarrollo local
-- y puede ser fácilmente migrado a PostgreSQL en producción

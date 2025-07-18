-- =====================================================
-- SISTEMA CLUB SALVADOREÑO - DATOS INICIALES
-- =====================================================

-- Insertar usuarios administrativos
INSERT OR IGNORE INTO users (id, first_name, last_name, username, password, email, phone, role, is_active, status, created_at) VALUES
('1', 'Super', 'Administrador', 'superadmin', 'SuperAdmin123', 'superadmin@clubsalvadoreno.com', '+503 2345-6789', 'super_admin', TRUE, 'approved', '2024-01-01 00:00:00'),
('2', 'Ana', 'García', 'atencion', 'Atencion123', 'atencion@clubsalvadoreno.com', '+503 2345-6790', 'atencion_miembro', TRUE, 'approved', '2024-01-01 00:00:00'),
('3', 'Carlos', 'Rodríguez', 'anfitrion', 'Anfitrion123', 'carlos.rodriguez@email.com', '+503 2345-6791', 'anfitrion', TRUE, 'approved', '2024-01-15 00:00:00'),
('4', 'David', 'López', 'monitor', 'Monitor123', 'monitor@clubsalvadoreno.com', '+503 2345-6792', 'monitor', TRUE, 'approved', '2024-01-15 00:00:00'),
('5', 'Elena', 'Martínez', 'mercadeo', 'Mercadeo123', 'mercadeo@clubsalvadoreno.com', '+503 2345-6793', 'mercadeo', TRUE, 'approved', '2024-01-15 00:00:00'),
('11', 'Sofia', 'Herrera', 'recepcion', 'Recepcion123', 'recepcion@clubsalvadoreno.com', '+503 2345-6794', 'recepcion', TRUE, 'approved', '2024-01-15 00:00:00'),
('12', 'Roberto', 'Portillo', 'portero', 'Portero123', 'portero@clubsalvadoreno.com', '+503 7890-1234', 'porteria', TRUE, 'approved', '2024-01-01 09:00:00');

-- Insertar miembros del club
INSERT OR IGNORE INTO users (id, first_name, last_name, username, password, email, phone, role, is_active, status, member_status, membership_type, created_at) VALUES
('6', 'María José', 'González', 'usuario1', 'Usuario123', 'usuario1@email.com', '+503 7234-5678', 'miembro', TRUE, 'approved', 'activo', 'Contribuyente', '2024-02-01 00:00:00'),
('7', 'Carlos', 'Rivera', 'carlos.rivera', 'Carlos2024', 'carlos.rivera@email.com', '+503 7234-5679', 'miembro', TRUE, 'approved', 'activo', 'Fundador', '2024-02-10 00:00:00'),
('8', 'Ana', 'Martínez', 'ana.martinez', 'Ana123456', 'ana.martinez@email.com', '+503 7234-5680', 'miembro', TRUE, 'approved', 'en_mora', 'Honorario', '2024-02-15 00:00:00'),
('9', 'Juan', 'Pérez', 'jperez', 'JuanP123', 'juan.perez@email.com', '+503 7234-5681', 'miembro', FALSE, 'approved', 'inactivo', NULL, '2024-03-01 00:00:00'),
('10', 'Demo', 'Usuario', 'demo', 'demo123', 'demo@clubsalvadoreno.com', '+503 7234-5682', 'miembro', TRUE, 'approved', 'activo', NULL, '2024-01-01 00:00:00');

-- Insertar alojamientos de El Sunzal
INSERT OR IGNORE INTO accommodations (id, name, type, location, capacity, description, amenities, pricing_weekday, pricing_weekend, pricing_holiday, images, available, view_type, featured, created_at) VALUES
-- Apartamentos El Sunzal
('1A', 'Apartamento 1A', 'apartamento', 'el-sunzal', 2, 'Cómodo apartamento con vista directa al mar, perfecto para parejas. Ubicado en el primer piso con fácil acceso y todas las comodidades necesarias.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette", "Vista al mar"]', 110.00, 230.00, 280.00, 
'["/api/images/apartamentos/1a-main.jpg", "/api/images/apartamentos/1a-bedroom.jpg"]', TRUE, 'Vista al mar', FALSE, CURRENT_TIMESTAMP),

('1B', 'Apartamento 1B', 'apartamento', 'el-sunzal', 2, 'Apartamento acogedor con vista parcial al mar. Ideal para una estancia romántica con todas las comodidades modernas.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"]', 95.00, 210.00, 260.00, 
'["/api/images/apartamentos/1b-main.jpg", "/api/images/apartamentos/1b-living.jpg"]', TRUE, 'Vista parcial', FALSE, CURRENT_TIMESTAMP),

('2A', 'Apartamento 2A', 'apartamento', 'el-sunzal', 4, 'Espacioso apartamento para familias con vista premium al mar. Segundo piso con balcón privado y cocina completa.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa", "Balcón"]', 120.00, 250.00, 300.00, 
'["/api/images/apartamentos/2a-main.jpg", "/api/images/apartamentos/2a-balcony.jpg"]', TRUE, 'Vista al mar premium', FALSE, CURRENT_TIMESTAMP),

-- Casas El Sunzal
('casa-surf-paradise', 'Casa Surf Paradise', 'casa', 'el-sunzal', 6, 'Casa diseñada especialmente para surfistas con acceso directo al break. Incluye almacenamiento para tablas y ducha exterior.', 
'["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza", "Almacenamiento para tablas", "Ducha exterior"]', 250.00, 450.00, 550.00, 
'["/api/images/casas/surf-paradise-main.jpg", "/api/images/casas/surf-paradise-exterior.jpg"]', TRUE, 'Frente al mar', TRUE, CURRENT_TIMESTAMP),

('casa-familiar-deluxe', 'Casa Familiar Deluxe', 'casa', 'el-sunzal', 8, 'Casa amplia y familiar con todas las comodidades para grupos grandes. Jardín privado, BBQ y sala de juegos incluidos.', 
'["Wi-Fi", "Aire acondicionado", "Cocina gourmet", "Jardín privado", "BBQ", "Sala de juegos"]', 300.00, 550.00, 650.00, 
'["/api/images/casas/familiar-deluxe-main.jpg", "/api/images/casas/familiar-deluxe-garden.jpg"]', TRUE, 'Amplia vista', FALSE, CURRENT_TIMESTAMP);

-- Insertar algunas suites premium de El Sunzal
INSERT OR IGNORE INTO accommodations (id, name, type, location, capacity, description, amenities, pricing_weekday, pricing_weekend, pricing_holiday, images, available, view_type, featured, created_at) VALUES
('suite-1', 'Suite Premium 1', 'suite', 'el-sunzal', 2, 'Suite de lujo número 1 con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Balcón privado"]', 180.00, 320.00, 420.00, 
'["/api/images/suites/suite-1-main.jpg", "/api/images/suites/suite-1-view.jpg"]', TRUE, 'Premium', TRUE, CURRENT_TIMESTAMP),

('suite-2', 'Suite Premium 2', 'suite', 'el-sunzal', 3, 'Suite de lujo número 2 con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.', 
'["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Balcón privado"]', 190.00, 335.00, 440.00, 
'["/api/images/suites/suite-2-main.jpg", "/api/images/suites/suite-2-view.jpg"]', TRUE, 'Premium', TRUE, CURRENT_TIMESTAMP);

-- Insertar alojamientos de Corinto
INSERT OR IGNORE INTO accommodations (id, name, type, location, capacity, description, amenities, pricing_weekday, pricing_weekend, pricing_holiday, images, available, view_type, featured, created_at) VALUES
('corinto-casa-1', 'Casa Corinto 1', 'casa', 'corinto', 4, 'Casa moderna 1 en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina equipada", "Terraza", "Jardín", "BBQ"]', 140.00, 280.00, 350.00, 
'["/api/images/corinto/casa-1-main.jpg", "/api/images/corinto/casa-1-lake.jpg"]', TRUE, 'Vista lago', TRUE, CURRENT_TIMESTAMP),

('corinto-casa-2', 'Casa Corinto 2', 'casa', 'corinto', 4, 'Casa moderna 2 en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.', 
'["Wi-Fi", "Aire acondicionado", "TV", "Cocina equipada", "Terraza", "Jardín", "BBQ"]', 155.00, 305.00, 380.00, 
'["/api/images/corinto/casa-2-main.jpg", "/api/images/corinto/casa-2-lake.jpg"]', TRUE, 'Vista lago', FALSE, CURRENT_TIMESTAMP);

-- Insertar reglas de precios para acompañantes
INSERT OR IGNORE INTO pricing_rules (location, category, description, price, is_active) VALUES
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
INSERT OR IGNORE INTO holidays (date, name, description) VALUES
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
INSERT OR IGNORE INTO system_settings (key_name, value, description, type, category) VALUES
('max_reservation_days', '7', 'Máximo número de días consecutivos para una reserva', 'number', 'reservations'),
('min_advance_booking_hours', '24', 'Mínimo de horas de anticipación para hacer una reserva', 'number', 'reservations'),
('notification_email', 'notifications@clubsalvadoreno.com', 'Email para notificaciones del sistema', 'string', 'notifications'),
('site_name', 'Club Salvadoreño', 'Nombre del sitio web', 'string', 'general'),
('maintenance_mode', 'false', 'Modo de mantenimiento del sistema', 'boolean', 'system');

-- Insertar algunas solicitudes de registro de ejemplo
INSERT OR IGNORE INTO registration_requests (id, first_name, last_name, email, phone, document_type, document_number, member_code, password, status, submitted_at) VALUES
('req-001', 'María', 'González', 'maria.gonzalez@email.com', '+503 7234-5678', 'dui', '12345678-9', 'MEM001', 'TempPass123', 'pending', '2024-01-15 10:30:00'),
('req-002', 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '+503 7234-5679', 'passport', 'AB123456', 'MEM002', 'TempPass123', 'pending', '2024-01-14 15:20:00'),
('req-003', 'Ana', 'Martínez', 'ana.martinez@email.com', '+503 7234-5680', 'dui', '98765432-1', 'MEM003', 'TempPass123', 'approved', '2024-01-13 09:15:00'),
('req-004', 'Roberto', 'Flores', 'roberto.flores@email.com', '+503 7234-5681', 'dui', '11223344-5', 'MEM004', 'TempPass123', 'rejected', '2024-01-12 14:30:00');

-- Insertar notificaciones de ejemplo
INSERT OR IGNORE INTO notifications (id, type, title, message, is_read, created_at) VALUES
('notif-001', 'user_registration', 'Nueva solicitud de registro', 'Nueva solicitud de registro de María González requiere aprobación', FALSE, CURRENT_TIMESTAMP),
('notif-002', 'user_registration', 'Nueva solicitud de registro', 'Nueva solicitud de registro de Carlos Rodríguez requiere aprobación', FALSE, CURRENT_TIMESTAMP),
('notif-003', 'system', 'Sistema iniciado', 'El sistema Club Salvadoreño ha sido iniciado correctamente', TRUE, CURRENT_TIMESTAMP);

-- Insertar algunas reservas de ejemplo
INSERT OR IGNORE INTO reservations (id, user_id, accommodation_id, check_in, check_out, guests, total_price, status, created_at, weekday_days, weekend_days, holiday_days, weekday_total, weekend_total, holiday_total) VALUES
('res-001', '6', '1A', '2024-01-15', '2024-01-17', 2, 340.00, 'completed', '2024-01-10 10:00:00', 1, 1, 0, 110.00, 230.00, 0.00),
('res-002', '7', 'casa-surf-paradise', '2024-02-01', '2024-02-03', 4, 700.00, 'confirmed', '2024-01-25 14:00:00', 1, 1, 0, 250.00, 450.00, 0.00);

-- Insertar algunas reseñas de ejemplo
INSERT OR IGNORE INTO reviews (id, accommodation_id, user_id, reservation_id, rating, title, comment, cleanliness, communication, checkin, accuracy, location_rating, value_rating, created_at) VALUES
('rev-001', '1A', '6', 'res-001', 5, 'Excelente estadía con vista al mar', 'El apartamento superó nuestras expectativas. La vista al mar es espectacular y las instalaciones están impecables.', 5, 5, 5, 5, 5, 4, '2024-01-18 10:00:00');

-- Insertar algunos logs de actividad
INSERT OR IGNORE INTO activity_logs (id, date, type, location, accommodation_id, description, details, user_id, status, priority, created_at) VALUES
('log-001', '2024-01-18', 'cleaning', 'el-sunzal', '1A', 'Limpieza profunda apartamento 1A', 'Limpieza completa después de huéspedes. Todo en perfecto estado.', '11', 'completed', 'medium', '2024-01-18 12:00:00'),
('log-002', '2024-01-19', 'maintenance', 'el-sunzal', 'casa-surf-paradise', 'Revisión ducha exterior', 'Revisión programada de la ducha exterior. Funcionando correctamente.', '3', 'completed', 'low', '2024-01-19 09:00:00');

-- Datos iniciales insertados exitosamente

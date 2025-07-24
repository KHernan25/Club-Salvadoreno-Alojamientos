-- =====================================================
-- DATOS REALES DE ALOJAMIENTOS - CLUB SALVADOREÑO
-- =====================================================

-- Eliminar alojamientos de ejemplo
DELETE FROM accommodations WHERE id IN ('acc-001', 'acc-002', 'acc-003');

-- =====================================================
-- CORINTO - 6 CASAS
-- =====================================================

INSERT INTO accommodations (
    id, name, description, type, capacity, price_per_night, 
    images, amenities, availability_status, is_active
) VALUES

-- Casa Corinto 1
(
    'corinto-casa-001',
    'Casa Corinto Marina',
    'Hermosa casa frente al mar en Corinto con vista panorámica al océano Pacífico. Cuenta con amplias terrazas, cocina completa y todas las comodidades para una estancia perfecta. Ideal para familias que buscan tranquilidad y contacto directo con la naturaleza marina.',
    'casa',
    8,
    180.00,
    '["corinto-casa-1-exterior.jpg", "corinto-casa-1-living.jpg", "corinto-casa-1-bedroom.jpg", "corinto-casa-1-kitchen.jpg", "corinto-casa-1-terrace.jpg"]',
    '["wifi", "aire_acondicionado", "tv", "cocina_completa", "terraza", "vista_mar", "parrilla", "estacionamiento", "piscina_compartida"]',
    'available',
    TRUE
),

-- Casa Corinto 2
(
    'corinto-casa-002',
    'Casa Corinto Pacífico',
    'Casa de dos niveles con diseño moderno y elegante, ubicada a pocos metros de la playa. Perfecta para grupos grandes que desean privacidad y comodidad. Incluye área social amplia y dormitorios con aire acondicionado individual.',
    'casa',
    10,
    220.00,
    '["corinto-casa-2-exterior.jpg", "corinto-casa-2-living.jpg", "corinto-casa-2-bedroom1.jpg", "corinto-casa-2-bedroom2.jpg", "corinto-casa-2-pool.jpg"]',
    '["wifi", "aire_acondicionado", "tv", "cocina_completa", "terraza", "vista_mar", "parrilla", "estacionamiento", "piscina_privada", "balcon"]',
    'available',
    TRUE
),

-- Casa Corinto 3
(
    'corinto-casa-003',
    'Casa Corinto Familiar',
    'Casa tradicional con estilo costero, perfecta para reuniones familiares. Cuenta con amplio jardín, área de juegos para niños y espacios diseñados para el descanso y la recreación. Ubicación estratégica cerca de servicios.',
    'casa',
    6,
    150.00,
    '["corinto-casa-3-exterior.jpg", "corinto-casa-3-garden.jpg", "corinto-casa-3-living.jpg", "corinto-casa-3-kids-area.jpg"]',
    '["wifi", "aire_acondicionado", "tv", "cocina_completa", "jardin", "area_juegos", "parrilla", "estacionamiento", "lavanderia"]',
    'available',
    TRUE
),

-- Casa Corinto 4
(
    'corinto-casa-004',
    'Casa Corinto Deluxe',
    'La casa más elegante de nuestro complejo en Corinto. Diseño arquitectónico contemporáneo con acabados de lujo, piscina privada climatizada y jacuzzi. Ideal para ocasiones especiales y huéspedes VIP que buscan lo mejor.',
    'casa',
    12,
    300.00,
    '["corinto-casa-4-exterior.jpg", "corinto-casa-4-pool.jpg", "corinto-casa-4-jacuzzi.jpg", "corinto-casa-4-master.jpg", "corinto-casa-4-dining.jpg"]',
    '["wifi", "aire_acondicionado", "tv", "cocina_gourmet", "piscina_climatizada", "jacuzzi", "vista_mar", "parrilla", "estacionamiento", "servicio_housekeeping", "terraza_amplia"]',
    'available',
    TRUE
),

-- Casa Corinto 5
(
    'corinto-casa-005',
    'Casa Corinto Brisa',
    'Casa de una planta con diseño funcional y acogedor. Perfecta para estancias prolongadas, cuenta con todas las comodidades necesarias y un ambiente relajante. Ideal para parejas o familias pequeñas que buscan tranquilidad.',
    'casa',
    4,
    120.00,
    '["corinto-casa-5-exterior.jpg", "corinto-casa-5-living.jpg", "corinto-casa-5-bedroom.jpg", "corinto-casa-5-patio.jpg"]',
    '["wifi", "aire_acondicionado", "tv", "cocina_completa", "patio", "parrilla", "estacionamiento", "ventiladores"]',
    'available',
    TRUE
),

-- Casa Corinto 6
(
    'corinto-casa-006',
    'Casa Corinto Sunset',
    'Casa con ubicación privilegiada para observar los atardeceres más espectaculares de Corinto. Diseño abierto que aprovecha la brisa marina y vistas panorámicas. Perfecta para momentos románticos y relajación total.',
    'casa',
    6,
    160.00,
    '["corinto-casa-6-sunset.jpg", "corinto-casa-6-terrace.jpg", "corinto-casa-6-living.jpg", "corinto-casa-6-bedroom.jpg"]',
    '["wifi", "aire_acondicionado", "tv", "cocina_completa", "terraza_sunset", "vista_panoramica", "parrilla", "estacionamiento", "hamacas"]',
    'available',
    TRUE
);

-- =====================================================
-- EL SUNZAL - 16 SUITES
-- =====================================================

INSERT INTO accommodations (
    id, name, description, type, capacity, price_per_night, 
    images, amenities, availability_status, is_active
) VALUES

-- Suites El Sunzal (1-16)
(
    'sunzal-suite-001',
    'Suite El Sunzal Presidencial',
    'La suite más exclusiva del complejo, ubicada en el piso superior con vista panorámica al océano Pacífico y acceso directo a la playa. Cuenta con sala de estar privada, dormitorio principal con cama king size, baño de lujo con jacuzzi y terraza privada con servicio de mayordomía.',
    'suite',
    4,
    250.00,
    '["sunzal-suite-1-ocean.jpg", "sunzal-suite-1-bedroom.jpg", "sunzal-suite-1-bathroom.jpg", "sunzal-suite-1-terrace.jpg", "sunzal-suite-1-living.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "jacuzzi", "vista_mar", "terraza_privada", "servicio_habitacion", "balcon", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-002',
    'Suite El Sunzal Ocean View',
    'Suite de lujo con vista directa al mar, perfecta para parejas en luna de miel o aniversarios. Decoración elegante con elementos locales, baño con ducha de lluvia y acceso directo a la piscina infinity del hotel.',
    'suite',
    2,
    200.00,
    '["sunzal-suite-2-view.jpg", "sunzal-suite-2-bedroom.jpg", "sunzal-suite-2-bathroom.jpg", "sunzal-suite-2-balcony.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "ducha_lluvia", "vista_mar", "acceso_piscina", "balcon", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-003',
    'Suite El Sunzal Garden',
    'Suite con vista a los jardines tropicales del resort, diseñada para ofrecer tranquilidad y conexión con la naturaleza. Cuenta con terraza privada rodeada de vegetación exuberante y acceso directo a senderos del jardín.',
    'suite',
    3,
    180.00,
    '["sunzal-suite-3-garden.jpg", "sunzal-suite-3-bedroom.jpg", "sunzal-suite-3-terrace.jpg", "sunzal-suite-3-bathroom.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "vista_jardin", "terraza_privada", "acceso_jardin", "ventilador", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-004',
    'Suite El Sunzal Deluxe',
    'Suite espaciosa con sala de estar independiente y dormitorio principal. Ideal para familias que buscan comodidad y elegancia. Incluye área de trabajo, baño completo con bañera y amplio espacio de almacenamiento.',
    'suite',
    4,
    220.00,
    '["sunzal-suite-4-living.jpg", "sunzal-suite-4-bedroom.jpg", "sunzal-suite-4-bathroom.jpg", "sunzal-suite-4-workspace.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "sala_estar", "area_trabajo", "bañera", "vista_parcial_mar", "balcon", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-005',
    'Suite El Sunzal Junior',
    'Suite acogedora perfecta para parejas, con diseño moderno y funcional. Cuenta con todas las comodidades esenciales en un espacio optimizado que maximiza la comodidad sin sacrificar el estilo.',
    'suite',
    2,
    160.00,
    '["sunzal-suite-5-interior.jpg", "sunzal-suite-5-bedroom.jpg", "sunzal-suite-5-bathroom.jpg", "sunzal-suite-5-balcony.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "diseño_moderno", "balcon", "ducha", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-006',
    'Suite El Sunzal Premium',
    'Suite de alto nivel con acabados de primera calidad y mobiliario de diseñador. Ofrece una experiencia de lujo con atención personalizada y servicios exclusivos para huéspedes distinguidos.',
    'suite',
    3,
    190.00,
    '["sunzal-suite-6-premium.jpg", "sunzal-suite-6-bedroom.jpg", "sunzal-suite-6-bathroom.jpg", "sunzal-suite-6-amenities.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "mobiliario_diseñador", "servicio_premium", "productos_lujo", "vista_mar", "balcon", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-007',
    'Suite El Sunzal Familiar',
    'Suite diseñada especialmente para familias con niños, cuenta con área de juegos, literas adicionales y todas las comodidades necesarias para una estancia familiar perfecta.',
    'suite',
    6,
    240.00,
    '["sunzal-suite-7-family.jpg", "sunzal-suite-7-kids.jpg", "sunzal-suite-7-bedroom.jpg", "sunzal-suite-7-living.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "area_juegos", "literas", "cocina_pequeña", "vista_jardin", "balcon_grande", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-008',
    'Suite El Sunzal Romantic',
    'Suite especialmente diseñada para parejas, con decoración romántica, iluminación ambiental y servicios especiales para ocasiones íntimas como luna de miel o aniversarios.',
    'suite',
    2,
    210.00,
    '["sunzal-suite-8-romantic.jpg", "sunzal-suite-8-bedroom.jpg", "sunzal-suite-8-bathroom.jpg", "sunzal-suite-8-ambiance.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "decoracion_romantica", "iluminacion_ambiental", "jacuzzi", "vista_mar", "terraza_intima", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-009',
    'Suite El Sunzal Executive',
    'Suite orientada a viajeros de negocios, equipada con área de trabajo completa, conexión a internet de alta velocidad y servicios de oficina. Ideal para quienes combinan trabajo y placer.',
    'suite',
    2,
    195.00,
    '["sunzal-suite-9-executive.jpg", "sunzal-suite-9-office.jpg", "sunzal-suite-9-bedroom.jpg", "sunzal-suite-9-meeting.jpg"]',
    '["wifi_premium", "aire_acondicionado", "tv_smart", "minibar", "oficina_completa", "internet_alta_velocidad", "servicio_negocios", "vista_ciudad", "balcon", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-010',
    'Suite El Sunzal Wellness',
    'Suite enfocada en el bienestar y la relajación, cuenta con área de yoga privada, productos de spa y ambiente zen para una experiencia de renovación total.',
    'suite',
    2,
    185.00,
    '["sunzal-suite-10-wellness.jpg", "sunzal-suite-10-yoga.jpg", "sunzal-suite-10-spa.jpg", "sunzal-suite-10-zen.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "area_yoga", "productos_spa", "ambiente_zen", "vista_jardin", "terraza_meditacion", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-011',
    'Suite El Sunzal Adventure',
    'Suite diseñada para huéspedes activos y aventureros, con equipamiento deportivo disponible y acceso directo a actividades acuáticas y terrestres del resort.',
    'suite',
    3,
    175.00,
    '["sunzal-suite-11-adventure.jpg", "sunzal-suite-11-sports.jpg", "sunzal-suite-11-equipment.jpg", "sunzal-suite-11-access.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "equipamiento_deportivo", "acceso_actividades", "ducha_exterior", "vista_mar", "balcon_deportivo", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-012',
    'Suite El Sunzal Sunset',
    'Suite con orientación oeste para disfrutar de los atardeceres más espectaculares. Terraza amplia con zona de descanso y vista privilegiada para momentos únicos.',
    'suite',
    3,
    205.00,
    '["sunzal-suite-12-sunset.jpg", "sunzal-suite-12-terrace.jpg", "sunzal-suite-12-bedroom.jpg", "sunzal-suite-12-evening.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "vista_sunset", "terraza_amplia", "zona_descanso", "iluminacion_nocturna", "hamacas", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-013',
    'Suite El Sunzal Classic',
    'Suite con decoración clásica y elegante, que combina la tradición con el confort moderno. Perfecta para huéspedes que aprecian el estilo atemporal y la sofisticación.',
    'suite',
    2,
    170.00,
    '["sunzal-suite-13-classic.jpg", "sunzal-suite-13-decor.jpg", "sunzal-suite-13-bedroom.jpg", "sunzal-suite-13-bathroom.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "decoracion_clasica", "mobiliario_elegante", "vista_jardin", "balcon", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-014',
    'Suite El Sunzal Modern',
    'Suite con diseño contemporáneo y tecnología de vanguardia. Ideal para huéspedes que buscan la última palabra en innovación y comodidad moderna.',
    'suite',
    2,
    190.00,
    '["sunzal-suite-14-modern.jpg", "sunzal-suite-14-tech.jpg", "sunzal-suite-14-bedroom.jpg", "sunzal-suite-14-smart.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "diseño_contemporaneo", "tecnologia_avanzada", "automatizacion", "vista_mar", "balcon_moderno", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-015',
    'Suite El Sunzal Tropical',
    'Suite con temática tropical que celebra la belleza natural de El Salvador. Decorada con elementos artesanales locales y colores vibrantes que reflejan la cultura del país.',
    'suite',
    3,
    165.00,
    '["sunzal-suite-15-tropical.jpg", "sunzal-suite-15-local.jpg", "sunzal-suite-15-artisan.jpg", "sunzal-suite-15-culture.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "decoracion_tropical", "artesanias_locales", "colores_vibrantes", "vista_jardin", "terraza_tropical", "caja_fuerte"]',
    'available',
    TRUE
),

(
    'sunzal-suite-016',
    'Suite El Sunzal Penthouse',
    'La suite más alta del complejo, con vista de 360 grados y acceso exclusivo a la terraza del techo. Experiencia VIP completa con servicios de conserjería personal.',
    'suite',
    4,
    280.00,
    '["sunzal-suite-16-penthouse.jpg", "sunzal-suite-16-360view.jpg", "sunzal-suite-16-rooftop.jpg", "sunzal-suite-16-luxury.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "minibar", "vista_360", "terraza_exclusiva", "conserjeria_personal", "acceso_rooftop", "bar_privado", "caja_fuerte"]',
    'available',
    TRUE
);

-- =====================================================
-- EL SUNZAL - 6 CASAS
-- =====================================================

INSERT INTO accommodations (
    id, name, description, type, capacity, price_per_night, 
    images, amenities, availability_status, is_active
) VALUES

-- Casas El Sunzal (1-6)
(
    'sunzal-casa-001',
    'Casa El Sunzal Beachfront',
    'Casa de lujo ubicada directamente en la playa con acceso privado al mar. Perfecta para grupos grandes que buscan privacidad total y experiencias exclusivas frente al océano Pacífico.',
    'casa',
    10,
    400.00,
    '["sunzal-casa-1-beachfront.jpg", "sunzal-casa-1-ocean.jpg", "sunzal-casa-1-private.jpg", "sunzal-casa-1-deck.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_gourmet", "acceso_playa_privado", "piscina_privada", "parrilla", "deck_oceanico", "estacionamiento", "servicio_limpieza"]',
    'available',
    TRUE
),

(
    'sunzal-casa-002',
    'Casa El Sunzal Villa Premium',
    'Villa de diseño arquitectónico excepcional con jardines paisajísticos y piscina infinity. Ideal para celebraciones especiales y reuniones familiares de alto nivel.',
    'casa',
    12,
    450.00,
    '["sunzal-casa-2-villa.jpg", "sunzal-casa-2-infinity.jpg", "sunzal-casa-2-garden.jpg", "sunzal-casa-2-celebration.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_gourmet", "piscina_infinity", "jardines_paisajisticos", "area_eventos", "parrilla_profesional", "estacionamiento", "chef_disponible"]',
    'available',
    TRUE
),

(
    'sunzal-casa-003',
    'Casa El Sunzal Surf Lodge',
    'Casa especialmente diseñada para surfistas, con área de almacenamiento para tablas, ducha exterior y ubicación estratégica cerca de los mejores breaks de la zona.',
    'casa',
    8,
    320.00,
    '["sunzal-casa-3-surf.jpg", "sunzal-casa-3-boards.jpg", "sunzal-casa-3-outdoor.jpg", "sunzal-casa-3-break.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_completa", "almacen_tablas", "ducha_exterior", "terraza_surf", "parrilla", "estacionamiento", "cerca_breaks"]',
    'available',
    TRUE
),

(
    'sunzal-casa-004',
    'Casa El Sunzal Retreat',
    'Casa diseñada para retiros y meditación, con espacios amplios para actividades grupales, jardín zen y ambiente de tranquilidad total.',
    'casa',
    15,
    380.00,
    '["sunzal-casa-4-retreat.jpg", "sunzal-casa-4-meditation.jpg", "sunzal-casa-4-zen.jpg", "sunzal-casa-4-group.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_industrial", "salon_actividades", "jardin_zen", "area_meditacion", "parrilla", "estacionamiento_amplio", "silencio_garantizado"]',
    'available',
    TRUE
),

(
    'sunzal-casa-005',
    'Casa El Sunzal Family Paradise',
    'Casa familiar con múltiples amenidades para niños, incluyendo piscina infantil, área de juegos y espacios seguros para que toda la familia disfrute sin preocupaciones.',
    'casa',
    14,
    350.00,
    '["sunzal-casa-5-family.jpg", "sunzal-casa-5-kids-pool.jpg", "sunzal-casa-5-playground.jpg", "sunzal-casa-5-safe.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_familiar", "piscina_infantil", "area_juegos", "espacios_seguros", "parrilla", "estacionamiento", "servicio_niñera"]',
    'available',
    TRUE
),

(
    'sunzal-casa-006',
    'Casa El Sunzal Executive Estate',
    'La propiedad más exclusiva del complejo, con servicio de mayordomía completo, chef privado disponible y todas las comodidades de una residencia de lujo.',
    'casa',
    16,
    500.00,
    '["sunzal-casa-6-estate.jpg", "sunzal-casa-6-luxury.jpg", "sunzal-casa-6-service.jpg", "sunzal-casa-6-dining.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_gourmet", "mayordomo_privado", "chef_privado", "servicio_completo", "piscina_climatizada", "estacionamiento_vip", "seguridad_24h"]',
    'available',
    TRUE
);

-- =====================================================
-- EL SUNZAL - 6 APARTAMENTOS
-- =====================================================

INSERT INTO accommodations (
    id, name, description, type, capacity, price_per_night, 
    images, amenities, availability_status, is_active
) VALUES

-- Apartamentos El Sunzal (1-6)
(
    'sunzal-apt-001',
    'Apartamento El Sunzal Ocean Breeze',
    'Apartamento moderno con vista al mar y diseño funcional. Perfecto para estancias prolongadas con todas las comodidades de un hogar, incluyendo cocina completa y área de trabajo.',
    'apartamento',
    4,
    140.00,
    '["sunzal-apt-1-ocean.jpg", "sunzal-apt-1-modern.jpg", "sunzal-apt-1-kitchen.jpg", "sunzal-apt-1-work.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_completa", "vista_mar", "area_trabajo", "lavanderia", "balcon", "estacionamiento"]',
    'available',
    TRUE
),

(
    'sunzal-apt-002',
    'Apartamento El Sunzal Garden View',
    'Apartamento rodeado de vegetación tropical con acceso directo a jardines. Ideal para quienes buscan tranquilidad y conexión con la naturaleza sin renunciar a las comodidades modernas.',
    'apartamento',
    3,
    120.00,
    '["sunzal-apt-2-garden.jpg", "sunzal-apt-2-tropical.jpg", "sunzal-apt-2-nature.jpg", "sunzal-apt-2-peaceful.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_completa", "vista_jardin", "acceso_jardin", "ventiladores", "terraza", "estacionamiento"]',
    'available',
    TRUE
),

(
    'sunzal-apt-003',
    'Apartamento El Sunzal Studio Deluxe',
    'Studio elegante y funcional, perfecto para parejas o viajeros individuales. Diseño optimizado que maximiza el espacio sin sacrificar comodidad y estilo.',
    'apartamento',
    2,
    100.00,
    '["sunzal-apt-3-studio.jpg", "sunzal-apt-3-elegant.jpg", "sunzal-apt-3-optimized.jpg", "sunzal-apt-3-couple.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "kitchenette", "diseño_optimizado", "vista_parcial_mar", "balcon_pequeño", "estacionamiento"]',
    'available',
    TRUE
),

(
    'sunzal-apt-004',
    'Apartamento El Sunzal Loft',
    'Loft de dos niveles con diseño industrial moderno y espacios amplios. Ideal para grupos pequeños que buscan un ambiente único y contemporáneo.',
    'apartamento',
    5,
    160.00,
    '["sunzal-apt-4-loft.jpg", "sunzal-apt-4-industrial.jpg", "sunzal-apt-4-levels.jpg", "sunzal-apt-4-contemporary.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_completa", "diseño_industrial", "dos_niveles", "espacios_amplios", "balcon_grande", "estacionamiento"]',
    'available',
    TRUE
),

(
    'sunzal-apt-005',
    'Apartamento El Sunzal Familiar',
    'Apartamento espacioso diseñado especialmente para familias, con múltiples dormitorios, área común amplia y comodidades pensadas para la comodidad de todos los miembros.',
    'apartamento',
    6,
    180.00,
    '["sunzal-apt-5-family.jpg", "sunzal-apt-5-spacious.jpg", "sunzal-apt-5-bedrooms.jpg", "sunzal-apt-5-common.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_familiar", "multiples_dormitorios", "area_comun_amplia", "lavanderia", "balcon_familiar", "estacionamiento"]',
    'available',
    TRUE
),

(
    'sunzal-apt-006',
    'Apartamento El Sunzal Penthouse',
    'Penthouse en el último piso con terraza panorámica y vistas espectaculares. La opción más exclusiva en apartamentos con acabados de lujo y servicios premium.',
    'apartamento',
    4,
    220.00,
    '["sunzal-apt-6-penthouse.jpg", "sunzal-apt-6-panoramic.jpg", "sunzal-apt-6-luxury.jpg", "sunzal-apt-6-premium.jpg"]',
    '["wifi", "aire_acondicionado", "tv_smart", "cocina_gourmet", "terraza_panoramica", "vistas_espectaculares", "acabados_lujo", "servicio_premium", "estacionamiento_privado"]',
    'available',
    TRUE
);

-- =====================================================
-- VERIFICACIÓN DE DATOS
-- =====================================================

-- Mostrar resumen de alojamientos insertados
SELECT 
    type as 'Tipo',
    COUNT(*) as 'Cantidad',
    MIN(price_per_night) as 'Precio Mínimo',
    MAX(price_per_night) as 'Precio Máximo',
    AVG(price_per_night) as 'Precio Promedio'
FROM accommodations 
GROUP BY type 
ORDER BY type;

-- Mostrar total de alojamientos por ubicación
SELECT 
    CASE 
        WHEN id LIKE 'corinto%' THEN 'Corinto'
        WHEN id LIKE 'sunzal%' THEN 'El Sunzal'
        ELSE 'Otros'
    END as 'Ubicación',
    type as 'Tipo',
    COUNT(*) as 'Cantidad'
FROM accommodations 
GROUP BY 
    CASE 
        WHEN id LIKE 'corinto%' THEN 'Corinto'
        WHEN id LIKE 'sunzal%' THEN 'El Sunzal'
        ELSE 'Otros'
    END,
    type
ORDER BY 
    CASE 
        WHEN id LIKE 'corinto%' THEN 'Corinto'
        WHEN id LIKE 'sunzal%' THEN 'El Sunzal'
        ELSE 'Otros'
    END,
    type;

COMMIT;

SELECT 'Datos reales de alojamientos insertados exitosamente' AS 'Status';
SELECT 'Total: 6 casas en Corinto + 16 suites + 6 casas + 6 apartamentos en El Sunzal = 34 alojamientos' AS 'Resumen';

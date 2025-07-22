-- Crear usuario ghernandez@clubsalvadoreno.com
INSERT INTO users (
  id, first_name, last_name, username, password, email, phone, role, 
  is_active, status, member_status, membership_type, created_at, updated_at
) VALUES (
  '13',
  'Karla',
  'Hernández', 
  'khernandez',
  'Karla123456',
  'ghernandez@clubsalvadoreno.com',
  '+503 2345-6795',
  'atencion_miembro',
  1,
  'approved',
  'activo',
  'Contribuyente',
  NOW(),
  NOW()
);

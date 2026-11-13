-- Dragones Marinos S.A.V. - datos iniciales
-- Ejecutar despues de 01_schema.sql.

USE `Softavision-pdv`;

INSERT IGNORE INTO users (id, name, email, password_hash, role, active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Carlos Mendoza', 'admin@dragonesmarinos.mx', '$2b$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'admin', 1),
  ('22222222-2222-2222-2222-222222222222', 'Maria Lopez', 'maria@dragonesmarinos.mx', '$2b$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'cashier', 1),
  ('33333333-3333-3333-3333-333333333333', 'Roberto Sanchez', 'roberto@dragonesmarinos.mx', '$2b$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'receptionist', 1);

INSERT IGNORE INTO categories (id, name, icon)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Goggles', 'glasses'),
  ('c2222222-2222-2222-2222-222222222222', 'Gorros', 'hat'),
  ('c3333333-3333-3333-3333-333333333333', 'Trajes de bano', 'shirt'),
  ('c4444444-4444-4444-4444-444444444444', 'Aletas', 'footprints'),
  ('c5555555-5555-5555-5555-555555555555', 'Servicios', 'waves');

INSERT IGNORE INTO students (id, enrollment_code, first_name, last_name, date_of_birth, phone, email, guardian_name, guardian_phone, emergency_contact, emergency_phone, medical_notes, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DM-2026-001', 'Sofia', 'Alvarez', '2015-03-12', '5550192', 'sofia@example.com', 'Mariana Rios', '5559876', 'Oscar Alvarez', '5551112', 'Sin notas medicas', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DM-2026-002', 'Mateo', 'Castillo', '2012-07-25', '5550133', NULL, 'Oscar Castillo', '5558765', 'Carmen Ruiz', '5552223', NULL, 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'DM-2026-003', 'Valeria', 'Luna', '2016-11-08', '5550148', NULL, 'Claudia Luna', '5557654', 'Roberto Luna', '5553334', NULL, 'active');

INSERT IGNORE INTO swim_groups (id, name, level, instructor, days_json, schedule, max_capacity, enrolled_count, inscription_cost, monthly_cost, active)
VALUES
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'Delfines', 'beginner', 'Ana Torres', JSON_ARRAY('Lunes', 'Miercoles'), '16:00 - 17:00', 15, 1, 500, 720, 1),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'Tiburones Jr.', 'intermediate', 'Luis Ortega', JSON_ARRAY('Martes', 'Jueves'), '17:00 - 18:00', 18, 1, 600, 780, 1),
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', 'Dragones Elite', 'team', 'Carla Ruiz', JSON_ARRAY('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'), '18:30 - 20:00', 12, 1, 700, 1150, 1);

INSERT IGNORE INTO enrollments (id, student_id, group_id, enrollment_date, status)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', '2026-07-01', 'active'),
  ('e2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '2026-07-01', 'active'),
  ('e3333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', '2026-07-01', 'active');

INSERT IGNORE INTO products (id, sku, barcode, name, description, category_id, brand, size, color, cost, sell_price, current_stock, min_stock, active)
VALUES
  ('p1111111-1111-1111-1111-111111111111', 'GM-GOG-01', '7501234567001', 'Goggles Pro Swim', 'Goggles antiniebla para entrenamiento', 'c1111111-1111-1111-1111-111111111111', 'Dragones', 'Unica', 'Azul', 180, 285, 18, 5, 'active'),
  ('p2222222-2222-2222-2222-222222222222', 'DM-CAP-02', '7501234567002', 'Gorra Dragones', 'Gorra de silicona institucional', 'c2222222-2222-2222-2222-222222222222', 'Dragones', 'Unica', 'Rojo', 70, 160, 32, 8, 'active'),
  ('p3333333-3333-3333-3333-333333333333', 'AQ-TAB-05', '7501234567003', 'Tabla de patada', 'Tabla de entrenamiento junior', 'c4444444-4444-4444-4444-444444444444', 'Aqua', 'Junior', 'Amarillo', 120, 220, 9, 4, 'active');

INSERT IGNORE INTO promotions (id, name, type, value, start_date, end_date, active, description)
VALUES
  ('promo1111-1111-1111-1111-111111111111', 'Inscripcion familiar', 'percentage', 15, '2026-07-01', '2026-08-15', 1, '15% en segunda inscripcion del mismo tutor'),
  ('promo2222-2222-2222-2222-222222222222', 'Kit de entrenamiento', 'fixed', 399, '2026-07-01', '2026-07-31', 1, 'Gorra y goggles con precio especial');

INSERT IGNORE INTO system_config (id, club_name, tax_id, address, phone, email, currency, tax_rate, next_folio, ticket_message, return_policy, payment_due_day, late_fee_percentage, late_fee_enabled, dark_mode)
VALUES
  ('sys11111-1111-1111-1111-111111111111', 'Dragones Marinos S.A.V.', NULL, 'Sucursal local', '555-123-4567', 'info@dragonesmarinos.mx', 'MXN', 16, 1, 'Gracias por preferir Dragones Marinos S.A.V.', 'Devoluciones dentro de 15 dias con ticket original.', 5, 5, 1, 0);

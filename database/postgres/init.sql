CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('admin', 'cashier', 'receptionist');
CREATE TYPE student_status AS ENUM ('active', 'suspended', 'inactive');
CREATE TYPE group_level AS ENUM ('beginner', 'intermediate', 'advanced', 'team');
CREATE TYPE enrollment_status AS ENUM ('active', 'transferred', 'cancelled');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue', 'partial');
CREATE TYPE product_status AS ENUM ('active', 'inactive');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer', 'mixed');
CREATE TYPE inventory_type AS ENUM ('entry', 'exit', 'adjustment', 'return', 'sale');
CREATE TYPE promotion_type AS ENUM ('percentage', 'fixed', '2x1', '3x2', 'min_purchase', 'enrollment', 'monthly');
CREATE TYPE cash_register_status AS ENUM ('open', 'closed');
CREATE TYPE sales_type AS ENUM ('sale', 'inscription', 'monthly_payment', 'return');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(120) NOT NULL,
    photo_url TEXT,
    date_of_birth DATE NOT NULL,
    curp VARCHAR(40),
    phone VARCHAR(20),
    email VARCHAR(120),
    guardian_name VARCHAR(120),
    guardian_phone VARCHAR(20),
    emergency_contact VARCHAR(120),
    emergency_phone VARCHAR(20),
    medical_notes TEXT,
    status student_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    level group_level NOT NULL,
    instructor VARCHAR(120) NOT NULL,
    days TEXT[] NOT NULL,
    schedule VARCHAR(80) NOT NULL,
    max_capacity INTEGER NOT NULL CHECK (max_capacity >= 0),
    enrolled_count INTEGER NOT NULL DEFAULT 0 CHECK (enrolled_count >= 0),
    inscription_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    monthly_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status enrollment_status NOT NULL DEFAULT 'active'
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(80) NOT NULL UNIQUE,
    barcode VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id),
    brand VARCHAR(120) NOT NULL,
    size VARCHAR(60),
    color VARCHAR(60),
    cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    sell_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    active product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE monthly_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0,
    late_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_due NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
    status payment_status NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio VARCHAR(40) NOT NULL UNIQUE,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_method payment_method NOT NULL,
    amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
    change_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    cashier_id UUID NOT NULL REFERENCES users(id),
    cashier_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type sales_type NOT NULL DEFAULT 'sale'
);

CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(160) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE cash_register_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    user_name VARCHAR(120) NOT NULL,
    status cash_register_status NOT NULL DEFAULT 'open',
    opening_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    closing_amount NUMERIC(12,2),
    expected_amount NUMERIC(12,2),
    difference_amount NUMERIC(12,2),
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    observations TEXT,
    sales_by_method JSONB
);

CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type inventory_type NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    movement_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id),
    reference VARCHAR(120),
    notes TEXT
);

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    type promotion_type NOT NULL,
    value NUMERIC(12,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    applicable_categories UUID[],
    applicable_products UUID[],
    min_purchase NUMERIC(12,2),
    description TEXT NOT NULL
);

CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_sale_id UUID NOT NULL REFERENCES sales(id),
    folio VARCHAR(40) NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    refund_method payment_method NOT NULL,
    total_refund NUMERIC(12,2) NOT NULL DEFAULT 0,
    authorized_by VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(160) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount NUMERIC(12,2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_name VARCHAR(120) NOT NULL,
    logo_url TEXT,
    tax_id VARCHAR(40),
    address TEXT,
    phone VARCHAR(30),
    email VARCHAR(120),
    currency VARCHAR(10) NOT NULL DEFAULT 'MXN',
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
    next_folio INTEGER NOT NULL DEFAULT 1,
    ticket_message TEXT,
    return_policy TEXT,
    payment_due_day INTEGER NOT NULL DEFAULT 5,
    late_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 5,
    late_fee_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_groups_active ON groups(active);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_group ON enrollments(group_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_monthly_payments_student ON monthly_payments(student_id);
CREATE INDEX idx_sales_cashier ON sales(cashier_id);
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_promotions_active ON promotions(active);

INSERT INTO users (id, name, email, password_hash, role, active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Carlos Mendoza', 'admin@dragonesmarinos.mx', '$2b$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'admin', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'María López', 'maria@dragonesmarinos.mx', '$2b$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'cashier', TRUE),
    ('33333333-3333-3333-3333-333333333333', 'Roberto Sánchez', 'roberto@dragonesmarinos.mx', '$2b$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'receptionist', TRUE);

INSERT INTO students (id, enrollment_code, first_name, last_name, date_of_birth, phone, email, guardian_name, guardian_phone, emergency_contact, emergency_phone, medical_notes, status)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DM-2024-001', 'Sofía', 'Hernández López', '2015-03-12', '5551234567', 'sofia.h@email.com', 'Laura López', '5559876543', 'Pedro Hernández', '5551112233', 'Asthma leve', 'active'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DM-2024-002', 'Mateo', 'García Ruiz', '2012-07-25', '5552345678', NULL, 'Carmen Ruiz', '5558765432', 'Juan García', '5552223344', NULL, 'active'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'DM-2024-003', 'Valentina', 'Martínez Díaz', '2016-11-08', '5553456789', NULL, 'Patricia Díaz', '5557654321', 'Roberto Martínez', '5553334455', NULL, 'active');

INSERT INTO groups (id, name, level, instructor, days, schedule, max_capacity, enrolled_count, inscription_cost, monthly_cost, active)
VALUES
    ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'Delfines', 'beginner', 'Coach Ramírez', ARRAY['Lunes', 'Miércoles', 'Viernes'], '8:00 - 9:00', 15, 12, 500, 800, TRUE),
    ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'Tiburones', 'intermediate', 'Coach Mendoza', ARRAY['Martes', 'Jueves', 'Sábado'], '9:00 - 10:30', 12, 10, 600, 1000, TRUE),
    ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', 'Mantas', 'advanced', 'Coach López', ARRAY['Lunes', 'Miércoles', 'Viernes'], '10:00 - 11:30', 10, 8, 700, 1200, TRUE);

INSERT INTO enrollments (id, student_id, group_id, enrollment_date, status)
VALUES
    ('e1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '2024-01-20', 'active'),
    ('e2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c', '2024-01-22', 'active'),
    ('e3333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '2024-02-01', 'active');

INSERT INTO categories (id, name, icon)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Goggles', 'glasses'),
    ('c2222222-2222-2222-2222-222222222222', 'Gorros', 'hat'),
    ('c3333333-3333-3333-3333-333333333333', 'Trajes de Baño', 'shirt'),
    ('c4444444-4444-4444-4444-444444444444', 'Aletas', 'footprints');

INSERT INTO products (id, sku, barcode, name, description, category_id, brand, size, color, cost, sell_price, current_stock, min_stock, active)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 'GOG-001', '7501234567001', 'Goggles Speedo Hydrovision', 'Goggles profesionales antiniebla', 'c1111111-1111-1111-1111-111111111111', 'Speedo', 'Única', 'Azul', 180, 349, 25, 5, 'active'),
    ('p2222222-2222-2222-2222-222222222222', 'GOR-001', '7501234567003', 'Gorro Silicona Speedo', 'Gorro de silicona resistente', 'c2222222-2222-2222-2222-222222222222', 'Speedo', 'M', 'Rojo', 60, 149, 30, 10, 'active'),
    ('p3333333-3333-3333-3333-333333333333', 'TRA-001', '7501234567005', 'Traje Baño Niño Speedo', 'Traje de baño para niños', 'c3333333-3333-3333-3333-333333333333', 'Speedo', '8', 'Azul', 200, 449, 15, 5, 'active');

INSERT INTO promotions (id, name, type, value, start_date, end_date, active, description)
VALUES
    ('promo1111-1111-1111-1111-111111111111', 'Escuela de Verano', 'percentage', 15, '2026-06-01', '2026-08-31', TRUE, '15% en trajes de baño para temporada de verano'),
    ('promo2222-2222-2222-2222-222222222222', '2x1 Gorros', '2x1', 0, '2026-07-01', '2026-07-31', TRUE, 'Lleva 2 gorros por el precio de 1');

INSERT INTO system_config (id, club_name, tax_id, address, phone, email, currency, tax_rate, next_folio, ticket_message, return_policy, payment_due_day, late_fee_percentage, late_fee_enabled, dark_mode)
VALUES
    ('sys11111-1111-1111-1111-111111111111', 'Dragones Marinos', 'RFC123456789', 'Av. Deportiva #500, Col. Los Naranjos, CDMX', '555-123-4567', 'info@dragonesmarinos.mx', 'MXN', 0, 6, '¡Gracias por preferir Dragones Marinos! 🐉🏊', 'Devoluciones dentro de 15 días con ticket original. Productos sin uso.', 5, 5, TRUE, FALSE);

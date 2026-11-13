-- Dragones Marinos S.A.V. - MariaDB schema
-- Ejecutar despues de 00_create_database_and_user.sql.

USE `Softavision-pdv`;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cashier', 'receptionist') NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  enrollment_code VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  photo_url TEXT,
  date_of_birth DATE,
  curp VARCHAR(40),
  phone VARCHAR(20),
  email VARCHAR(120),
  guardian_name VARCHAR(120),
  guardian_phone VARCHAR(20),
  emergency_contact VARCHAR(120),
  emergency_phone VARCHAR(20),
  medical_notes TEXT,
  status ENUM('active', 'suspended', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_students_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS swim_groups (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(80) NOT NULL,
  level ENUM('beginner', 'intermediate', 'advanced', 'team') NOT NULL,
  instructor VARCHAR(120) NOT NULL,
  days_json JSON NOT NULL,
  schedule VARCHAR(80) NOT NULL,
  max_capacity INT NOT NULL DEFAULT 0,
  enrolled_count INT NOT NULL DEFAULT 0,
  inscription_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_swim_groups_active (active),
  CHECK (max_capacity >= 0),
  CHECK (enrolled_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enrollments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  student_id CHAR(36) NOT NULL,
  group_id CHAR(36) NOT NULL,
  enrollment_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  status ENUM('active', 'transferred', 'cancelled') NOT NULL DEFAULT 'active',
  CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_group FOREIGN KEY (group_id) REFERENCES swim_groups(id) ON DELETE CASCADE,
  INDEX idx_enrollments_student (student_id),
  INDEX idx_enrollments_group (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sku VARCHAR(80) NOT NULL UNIQUE,
  barcode VARCHAR(80) UNIQUE,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  category_id CHAR(36),
  brand VARCHAR(120),
  size VARCHAR(60),
  color VARCHAR(60),
  cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  sell_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 0,
  active ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_products_category (category_id),
  INDEX idx_products_active (active),
  CHECK (current_stock >= 0),
  CHECK (min_stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS monthly_payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  student_id CHAR(36) NOT NULL,
  group_id CHAR(36),
  month INT NOT NULL,
  year INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  late_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_due DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('paid', 'pending', 'overdue', 'partial') NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_monthly_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_monthly_payments_group FOREIGN KEY (group_id) REFERENCES swim_groups(id) ON DELETE SET NULL,
  INDEX idx_monthly_payments_student (student_id),
  CHECK (month BETWEEN 1 AND 12)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sales (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  folio VARCHAR(40) NOT NULL UNIQUE,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method ENUM('cash', 'card', 'transfer', 'mixed') NOT NULL,
  amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0,
  change_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  cashier_id CHAR(36),
  cashier_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type ENUM('sale', 'inscription', 'monthly_payment', 'return') NOT NULL DEFAULT 'sale',
  CONSTRAINT fk_sales_cashier FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_sales_cashier (cashier_id),
  INDEX idx_sales_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sale_items (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sale_id CHAR(36) NOT NULL,
  product_id CHAR(36),
  product_name VARCHAR(160) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CHECK (quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cash_register_sessions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  user_name VARCHAR(120) NOT NULL,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  opening_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  closing_amount DECIMAL(12,2),
  expected_amount DECIMAL(12,2),
  difference_amount DECIMAL(12,2),
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  observations TEXT,
  sales_by_method_json JSON,
  CONSTRAINT fk_cash_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_movements (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  product_id CHAR(36) NOT NULL,
  type ENUM('entry', 'exit', 'adjustment', 'return', 'sale') NOT NULL,
  quantity INT NOT NULL,
  movement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id CHAR(36),
  reference VARCHAR(120),
  notes TEXT,
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_inventory_product (product_id),
  CHECK (quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS promotions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(120) NOT NULL,
  type ENUM('percentage', 'fixed', '2x1', '3x2', 'min_purchase', 'enrollment', 'monthly') NOT NULL,
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  applicable_categories_json JSON,
  applicable_products_json JSON,
  min_purchase DECIMAL(12,2),
  description TEXT NOT NULL,
  INDEX idx_promotions_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS returns (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  original_sale_id CHAR(36) NOT NULL,
  folio VARCHAR(40) NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  refund_method ENUM('cash', 'card', 'transfer', 'mixed') NOT NULL,
  total_refund DECIMAL(12,2) NOT NULL DEFAULT 0,
  authorized_by VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_returns_sale FOREIGN KEY (original_sale_id) REFERENCES sales(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS return_items (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  return_id CHAR(36) NOT NULL,
  product_id CHAR(36),
  product_name VARCHAR(160) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_return_items_return FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  CONSTRAINT fk_return_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CHECK (quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_config (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  club_name VARCHAR(120) NOT NULL,
  logo_url TEXT,
  tax_id VARCHAR(40),
  address TEXT,
  phone VARCHAR(30),
  email VARCHAR(120),
  currency VARCHAR(10) NOT NULL DEFAULT 'MXN',
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  next_folio INT NOT NULL DEFAULT 1,
  ticket_message TEXT,
  return_policy TEXT,
  payment_due_day INT NOT NULL DEFAULT 5,
  late_fee_percentage DECIMAL(5,2) NOT NULL DEFAULT 5,
  late_fee_enabled TINYINT(1) NOT NULL DEFAULT 1,
  dark_mode TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

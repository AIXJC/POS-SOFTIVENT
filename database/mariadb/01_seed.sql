INSERT INTO users (id, name, email, password_hash, role, active)
VALUES
  (UUID(), 'Super Admin', 'superadmin@example.com', '$2a$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'superadmin', 1),
  (UUID(), 'Mozo de tienda', 'user@example.com', '$2a$10$6IYQ0lSaG2gW9U/E7Y7LdeN1P2Gd2pY2kU/jjc7S1xLY5uoGE4eKq', 'user', 1);

INSERT INTO categories (id, name, description, icon, sort_order)
VALUES
  (UUID(), 'Snacks', 'Galletas, papas, frutos secos', 'snackbar', 1),
  (UUID(), 'Bebidas', 'Agua, gaseosas, jugos', 'cup-soda', 2),
  (UUID(), 'Carnes', 'Pollo, res, cerdo', 'meat', 3);

INSERT INTO products (id, sku, name, category_id, category_name, sell_price, stock, min_stock, active)
VALUES
  (UUID(), 'SN-CHOC-01', 'Galletas de Chocolate', (SELECT id FROM categories WHERE name='Snacks'), 'Snacks', 32, 120, 20, 1),
  (UUID(), 'SN-PAPA-02', 'Papas Fritas Medio Folio', (SELECT id FROM categories WHERE name='Snacks'), 'Snacks', 28, 80, 15, 1),
  (UUID(), 'BD-AGR-11', 'Agua 1.5L (6un)', (SELECT id FROM categories WHERE name='Bebidas'), 'Bebidas', 28, 56, 10, 1),
  (UUID(), 'BD-GAZ-12', 'Gaseosa 350ml', (SELECT id FROM categories WHERE name='Bebidas'), 'Bebidas', 16, 78, 15, 1),
  (UUID(), 'CA-POL-06', 'Pollo Madurado 500g', (SELECT id FROM categories WHERE name='Carnes'), 'Carnes', 95, 30, 8, 1);

INSERT INTO customers (id, name, phone, email, balance, status)
VALUES
  (UUID(), 'Carlos Mendoza', '555-1001', 'carlos@example.com', 0, 'Pagado'),
  (UUID(), 'Laura López', '555-1002', 'laura@example.com', 140, 'Pendiente');

INSERT INTO promotions (id, title, description, value, active, starts_at, ends_at)
VALUES
  (UUID(), 'Compra 2, lleva 1 gratis', 'Solo en productos de granos y conservas', '3x2', 1, '2026-08-01', '2026-08-15'),
  (UUID(), 'Descuento por volumen', '10% de descuento en compras superiores a 500', '10%', 1, '2026-07-20', '2026-07-31');
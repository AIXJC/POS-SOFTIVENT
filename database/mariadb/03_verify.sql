-- Verificacion basica de la base Softavision PDV.

USE `Softavision-pdv`;

SELECT DATABASE() AS current_database;

SELECT 'users' AS table_name, COUNT(*) AS rows_count FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'swim_groups', COUNT(*) FROM swim_groups
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'promotions', COUNT(*) FROM promotions
UNION ALL
SELECT 'system_config', COUNT(*) FROM system_config;

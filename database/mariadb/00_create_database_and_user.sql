-- Softavision PDV
-- Ejecutar con un usuario administrador de MariaDB/MySQL.
-- Este script NO elimina ni modifica bases existentes.

CREATE DATABASE IF NOT EXISTS `Softavision-pdv`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'SoftAdmin'@'localhost'
  IDENTIFIED BY 'SoftPass1';

CREATE USER IF NOT EXISTS 'SoftAdmin'@'127.0.0.1'
  IDENTIFIED BY 'SoftPass1';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, CREATE VIEW, SHOW VIEW, TRIGGER, EVENT
  ON `Softavision-pdv`.*
  TO 'SoftAdmin'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, CREATE VIEW, SHOW VIEW, TRIGGER, EVENT
  ON `Softavision-pdv`.*
  TO 'SoftAdmin'@'127.0.0.1';

FLUSH PRIVILEGES;

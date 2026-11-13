# Base de datos MariaDB

Esta carpeta crea una base de datos nueva e independiente para Softavision PDV.

No elimina ni modifica bases existentes.

## Base y usuario creados

Base de datos:

```text
Softavision-pdv
```

Usuario de aplicacion:

```text
SoftAdmin
```

Contrasena local inicial:

```text
SoftPass1
```

Permisos:

```text
SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, CREATE VIEW, SHOW VIEW, TRIGGER, EVENT
```

Solo sobre:

```text
Softavision-pdv.*
```

## Orden de ejecucion

Ejecuta estos scripts con un usuario administrador de MariaDB/MySQL.

```powershell
mysql -u root -p < database\mariadb\00_create_database_and_user.sql
mysql -u root -p < database\mariadb\01_schema.sql
mysql -u root -p < database\mariadb\02_seed.sql
mysql -u root -p < database\mariadb\03_verify.sql
```

Si usas `mariadb` en lugar de `mysql`:

```powershell
mariadb -u root -p < database\mariadb\00_create_database_and_user.sql
mariadb -u root -p < database\mariadb\01_schema.sql
mariadb -u root -p < database\mariadb\02_seed.sql
mariadb -u root -p < database\mariadb\03_verify.sql
```

Tambien puedes usar el instalador PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File database\mariadb\install.ps1
```

Si tu usuario administrador no es `root`:

```powershell
powershell -ExecutionPolicy Bypass -File database\mariadb\install.ps1 -AdminUser tu_usuario_admin
```

## Probar acceso del usuario de la app

```powershell
mysql -u SoftAdmin -p -h 127.0.0.1 Softavision-pdv
```

Cuando pida contrasena:

```text
SoftPass1
```

Luego dentro de MariaDB:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM students;
```

## Cadena de conexion

Para backend Node.js con MariaDB:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=Softavision-pdv
DB_USER=SoftAdmin
DB_PASSWORD=SoftPass1
```

## Tablas principales

- `users`
- `students`
- `swim_groups`
- `enrollments`
- `categories`
- `products`
- `monthly_payments`
- `sales`
- `sale_items`
- `cash_register_sessions`
- `inventory_movements`
- `promotions`
- `returns`
- `return_items`
- `system_config`

## Importante

El frontend actual sigue funcionando con `localStorage`.

Esta base queda lista para conectar un backend real sin mezclar datos con tu MariaDB existente.

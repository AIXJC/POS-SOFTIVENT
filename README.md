# Dragones Marinos S.A.V.

Sistema local de punto de venta y administracion para escuela/club de natacion. La version actual funciona como frontend local con persistencia en `localStorage`, por lo que puedes usarlo sin levantar APIs ni base de datos.

## Estado actual

- Frontend: React + TypeScript + Vite.
- Puerto local: `5175`.
- Datos: guardados en el navegador con `localStorage`.
- APIs `3001` y `3002`: no se usan para esta version local.
- Puerto `5173`: queda libre para tu otro sistema.

## Requisitos

1. Node.js instalado.
2. npm instalado.
3. Terminal PowerShell o CMD.

Para confirmar:

```powershell
node --version
npm.cmd --version
```

En PowerShell usa `npm.cmd` en lugar de `npm`, porque Windows puede bloquear `npm.ps1` por politica de ejecucion.

## Instalacion inicial

Desde la carpeta del proyecto:

```powershell
cd C:\Users\Ander\Desktop\DRAGONES_MARINOS_SFAVIS
npm.cmd install
```

Esto instala las dependencias en `node_modules`.

## Levantar el sistema local

```powershell
npm.cmd run dev
```

Despues abre:

```text
http://127.0.0.1:5175/
```

Credenciales demo:

```text
Usuario: admin
Contrasena: demo123
```

## Detener el sistema

Si lo corriste en una terminal normal, presiona:

```text
Ctrl + C
```

Si lo dejaste corriendo en segundo plano, busca el proceso:

```powershell
netstat -ano | findstr ":5175"
```

Luego detenlo con el PID que aparezca:

```powershell
Stop-Process -Id NUMERO_DEL_PID
```

## Compilar para produccion

```powershell
npm.cmd run build
```

El resultado queda en la carpeta `dist`.

Para previsualizar el build:

```powershell
npm.cmd run preview
```

La previsualizacion usa:

```text
http://127.0.0.1:4175/
```

## Puertos configurados

El proyecto esta configurado para evitar conflictos:

- `5175`: servidor de desarrollo del frontend.
- `4175`: preview de produccion.
- `3001`: libre para APIs externas.
- `3002`: libre para APIs externas.
- `5173`: libre para tu otro sistema.

Si `5175` estuviera ocupado:

```powershell
netstat -ano | findstr ":5175"
```

Puedes detener el proceso con `Stop-Process -Id PID`, o cambiar el puerto en:

- `package.json`
- `vite.config.js`
- `vite.config.ts`

## Uso del sistema

### Panel

Muestra ventas registradas, tickets, saldos pendientes y alertas de inventario.

### Punto de venta

1. Selecciona productos del catalogo.
2. Ajusta cantidades con `+` y `-`.
3. Escribe cliente o selecciona alumno.
4. Aplica descuento si corresponde.
5. Elige metodo de pago.
6. Presiona `Cobrar venta`.

Al cobrar:

- Se registra una transaccion.
- Se descuenta inventario para productos fisicos.
- El ticket queda disponible en `Tickets`.

### Inventario

Permite:

- Agregar producto.
- Editar nombre, SKU, categoria, stock y precio.
- Guardar cambios.
- Eliminar producto.
- Ver detalle del producto seleccionado.

### Alumnos

Permite:

- Registrar alumno.
- Asignar grupo.
- Consultar ficha del alumno.
- Registrar pago total de saldo pendiente.
- Eliminar alumno.

### Grupos

Permite:

- Crear grupo.
- Ver detalle del grupo.
- Cobrar mensualidad a todos los alumnos del grupo.
- Eliminar grupo.

### Mensualidades

Permite:

- Ver alumnos con saldo pendiente.
- Elegir metodo de pago.
- Registrar pago.
- Cargar mensualidad por grupo.

### Caja

Permite:

- Ver ventas por efectivo, tarjeta y transferencia.
- Contar efectivo por denominacion.
- Comparar efectivo esperado contra conteo fisico.
- Guardar corte de turno.

### Tickets

Permite:

- Ver transacciones.
- Ver detalle de ticket.
- Ver partidas del ticket.
- Cancelar ticket.
- Exportar CSV.

### Devoluciones

Permite:

- Seleccionar ticket completado.
- Ver detalle antes de devolver.
- Registrar motivo y observaciones.
- Marcar ticket como devuelto.
- Regresar stock al inventario cuando el ticket contiene productos fisicos.

### Promociones

Permite:

- Crear promocion.
- Activar o desactivar promocion.
- Ver detalle.
- Eliminar promocion.

### Reportes

Permite:

- Ver ingresos acumulados.
- Ver ticket promedio.
- Ver ventas por metodo de pago.
- Descargar reporte CSV.

### Ajustes

Permite:

- Cambiar nombre de sucursal.
- Cambiar caja inicial.
- Guardar ajustes.
- Restaurar datos demo.

## Persistencia de datos

Los datos se guardan en el navegador usando `localStorage`.

Esto significa:

- Si refrescas la pagina, los datos siguen.
- Si abres otro navegador, puede tener datos distintos.
- Si limpias datos del navegador, se borra la informacion local.

Para volver al estado inicial usa:

```text
Ajustes > Restaurar demo
```

## Diseno y navegacion

- La barra lateral tiene scroll interno.
- Puedes contraerla con el boton de panel para ganar espacio.
- Las tarjetas tienen detalles visibles y animaciones suaves.
- Los botones principales muestran efectos hover y estados activos.

## Solucion de problemas

### PowerShell no deja ejecutar npm

Usa:

```powershell
npm.cmd install
npm.cmd run dev
```

### El puerto 5175 ya esta ocupado

```powershell
netstat -ano | findstr ":5175"
Stop-Process -Id PID
```

### El sistema no carga

1. Confirma que el servidor este activo:

```powershell
netstat -ano | findstr ":5175"
```

2. Confirma que responde:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5175/
```

3. Reinicia:

```powershell
npm.cmd run dev
```

### Cambios raros en datos

Ve a:

```text
Ajustes > Restaurar demo
```

## Backend y PostgreSQL

El repositorio contiene una carpeta `backend` y una carpeta `database/postgres`, pero el frontend local actual no depende de ellas para funcionar.

Importante:

- El backend usa por defecto el puerto `3001`.
- Si quieres mantener `3001` y `3002` libres, no levantes el backend.
- La version local recomendada para uso inmediato es solo el frontend en `5175`.

## MariaDB para este sistema

Se agrego una estructura nueva e independiente en:

```text
database\mariadb
```

Base propuesta:

```text
Softavision-pdv
```

Usuario dedicado:

```text
SoftAdmin
```

Contrasena local inicial:

```text
SoftPass1
```

Orden de ejecucion con un usuario administrador de MariaDB/MySQL:

```powershell
mysql -u root -p < database\mariadb\00_create_database_and_user.sql
mysql -u root -p < database\mariadb\01_schema.sql
mysql -u root -p < database\mariadb\02_seed.sql
mysql -u root -p < database\mariadb\03_verify.sql
```

O con el instalador PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File database\mariadb\install.ps1
```

Estos scripts no eliminan ni modifican tus bases actuales. Solo crean la base `Softavision-pdv`, el usuario `SoftAdmin` y las tablas del sistema.

Archivo de variables de ejemplo:

```text
backend\.env.mariadb.example
```

Mas detalle:

```text
database\mariadb\README.md
```

## Comandos rapidos

```powershell
cd C:\Users\Ander\Desktop\DRAGONES_MARINOS_SFAVIS
npm.cmd install
npm.cmd run dev
```

Abrir:

```text
http://127.0.0.1:5175/
```

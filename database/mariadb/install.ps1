param(
  [string]$AdminUser = "root",
  [string]$HostName = "127.0.0.1",
  [int]$Port = 3306
)

$ErrorActionPreference = "Stop"

$mysql = Get-Command mysql.exe -ErrorAction SilentlyContinue
if (-not $mysql) {
  $mysql = Get-Command mariadb.exe -ErrorAction SilentlyContinue
}

if (-not $mysql) {
  Write-Host "No se encontro mysql.exe ni mariadb.exe en PATH." -ForegroundColor Red
  Write-Host "Instala el cliente de MariaDB/MySQL o ejecuta los .sql desde tu administrador de base de datos."
  exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$scripts = @(
  "00_create_database_and_user.sql",
  "01_schema.sql",
  "02_seed.sql",
  "03_verify.sql"
)

foreach ($script in $scripts) {
  $path = Join-Path $scriptDir $script
  Write-Host "Ejecutando $script..." -ForegroundColor Cyan
  Get-Content -Raw -LiteralPath $path | & $mysql.Source "-h$HostName" "-P$Port" "-u$AdminUser" "-p" "--default-character-set=utf8mb4"
}

Write-Host "Proceso terminado. Base esperada: Softavision-pdv" -ForegroundColor Green

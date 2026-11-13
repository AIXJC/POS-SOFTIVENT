$path = 'C:\Users\Ander\OneDrive\Desktop\DRAGONES_MARINOS_SFAVIS\src\components\layout\Header.tsx'
(Get-Content $path) -replace 'Dragones Marinos S.A.V.', 'Tienda de Abarrotes' | Set-Content $path -Encoding UTF8
Write-Host 'Done'
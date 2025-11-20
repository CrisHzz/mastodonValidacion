# Script rápido para iniciar Mastodon en desarrollo
# Uso: .\start-dev.ps1

param(
    [switch]$Setup,
    [switch]$Stop,
    [switch]$Logs,
    [switch]$Clean
)

$ComposeFile = "docker-compose.dev.yml"

function Show-Help {
    Write-Host @"
🐳 Mastodon Docker - Desarrollo

Uso:
  .\start-dev.ps1           Iniciar servicios
  .\start-dev.ps1 -Setup    Configuración inicial
  .\start-dev.ps1 -Stop     Detener servicios
  .\start-dev.ps1 -Logs     Ver logs
  .\start-dev.ps1 -Clean    Limpiar todo

Comandos útiles:
  docker-compose -f $ComposeFile ps              Ver estado
  docker-compose -f $ComposeFile logs -f web     Ver logs del web
  docker-compose -f $ComposeFile run --rm web bundle exec rails console

Acceso:
  Web: http://localhost:3000
  Streaming: http://localhost:4000
  Elasticsearch: http://localhost:9200
  PostgreSQL: localhost:5432
  Redis: localhost:6379

"@ -ForegroundColor Cyan
}

if ($Setup) {
    Write-Host "🔧 Ejecutando configuración inicial..." -ForegroundColor Yellow
    & .\docker-setup.ps1
    exit
}

if ($Stop) {
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile down
    Write-Host "✅ Servicios detenidos" -ForegroundColor Green
    exit
}

if ($Logs) {
    Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Yellow
    docker-compose -f $ComposeFile logs -f
    exit
}

if ($Clean) {
    $response = Read-Host "⚠️  Esto eliminará TODOS los datos. ¿Continuar? (s/n)"
    if ($response -match "^[sS]") {
        Write-Host "🧹 Limpiando..." -ForegroundColor Yellow
        docker-compose -f $ComposeFile down -v
        docker system prune -a --volumes -f
        Write-Host "✅ Limpieza completada" -ForegroundColor Green
    }
    exit
}

# Verificar si existe .env.development
if (-not (Test-Path .env.development)) {
    Write-Host "⚠️  No se encontró .env.development" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\start-dev.ps1 -Setup" -ForegroundColor Yellow
    exit 1
}

# Iniciar servicios
Write-Host "🚀 Iniciando Mastodon..." -ForegroundColor Cyan
docker-compose -f $ComposeFile up -d

Write-Host ""
Write-Host "✅ Servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Accede a: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver logs:" -ForegroundColor Yellow
Write-Host "  .\start-dev.ps1 -Logs" -ForegroundColor White
Write-Host ""
Write-Host "Detener:" -ForegroundColor Yellow
Write-Host "  .\start-dev.ps1 -Stop" -ForegroundColor White
Write-Host ""

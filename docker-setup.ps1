# Script de inicialización para desarrollo con Docker (PowerShell)

Write-Host "🐳 Configurando Mastodon con Docker..." -ForegroundColor Cyan

# Copiar archivo de entorno si no existe
if (-not (Test-Path .env.development)) {
    Write-Host "📝 Copiando archivo de configuración..." -ForegroundColor Yellow
    Copy-Item .env.development.docker .env.development
}

# Construir imágenes
Write-Host "🔨 Construyendo imágenes Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml build

# Iniciar servicios de base de datos
Write-Host "🚀 Iniciando servicios de base de datos..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d db redis es

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Crear base de datos
Write-Host "🗄️  Creando base de datos..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create

# Ejecutar migraciones
Write-Host "📊 Ejecutando migraciones..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# Crear datos de prueba (opcional)
$response = Read-Host "🌱 ¿Deseas crear datos de prueba? (s/n)"
if ($response -match "^[sS]") {
    docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:seed
}

# Precompilar assets (opcional para desarrollo)
$response = Read-Host "🎨 ¿Deseas precompilar assets? (s/n)"
if ($response -match "^[sS]") {
    docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails assets:precompile
}

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar todos los servicios:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker-compose.dev.yml up" -ForegroundColor White
Write-Host ""
Write-Host "Para crear un usuario administrador:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts create admin --email admin@localhost --confirmed --role Owner" -ForegroundColor White
Write-Host ""
Write-Host "Accede a Mastodon en: http://localhost:3000" -ForegroundColor Green
Write-Host ""

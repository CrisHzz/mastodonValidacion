#!/bin/bash
# Script de inicialización para desarrollo con Docker

set -e

echo "🐳 Configurando Mastodon con Docker..."

# Copiar archivo de entorno si no existe
if [ ! -f .env.development ]; then
    echo "📝 Copiando archivo de configuración..."
    cp .env.development.docker .env.development
fi

# Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
docker-compose -f docker-compose.dev.yml build

# Iniciar servicios de base de datos
echo "🚀 Iniciando servicios de base de datos..."
docker-compose -f docker-compose.dev.yml up -d db redis es

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Crear base de datos
echo "🗄️  Creando base de datos..."
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# Crear datos de prueba (opcional)
echo "🌱 ¿Deseas crear datos de prueba? (s/n)"
read -r response
if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
    docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:seed
fi

# Precompilar assets (opcional para desarrollo)
echo "🎨 ¿Deseas precompilar assets? (s/n)"
read -r response
if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
    docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails assets:precompile
fi

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "Para iniciar todos los servicios:"
echo "  docker-compose -f docker-compose.dev.yml up"
echo ""
echo "Para crear un usuario administrador:"
echo "  docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts create \\"
echo "    admin \\"
echo "    --email admin@localhost \\"
echo "    --confirmed \\"
echo "    --role Owner"
echo ""
echo "Accede a Mastodon en: http://localhost:3000"
echo ""

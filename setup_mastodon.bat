@echo off
echo ==========================================
echo   CONFIGURACION AUTOMATICA DE MASTODON
echo ==========================================

echo 1. Copiando archivo de entorno...
copy /Y .env.development.docker .env.development

echo.
echo 2. Limpiando contenedores anteriores...
docker compose -f docker-compose.dev.yml down

echo.
echo 3. Iniciando servicios de base de datos (DB, Redis, ES)...
docker compose -f docker-compose.dev.yml up -d db redis es

echo.
echo 4. Esperando 15 segundos a que la base de datos arranque...
timeout /t 15 /nobreak > NUL

echo.
echo 5. Creando la base de datos...
docker compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create

echo.
echo 6. Ejecutando migraciones...
docker compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

echo.
echo 7. Precompilando assets (esto puede tardar un poco)...
docker compose -f docker-compose.dev.yml run --rm web bundle exec rails assets:precompile

echo.
echo 8. Levantando todos los servicios...
docker compose -f docker-compose.dev.yml up -d

echo.
echo ==========================================
echo   TODO LISTO!
echo   Accede a Mastodon en: http://localhost:3000
echo ==========================================
pause

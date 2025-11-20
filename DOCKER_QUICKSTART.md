# 🚀 Inicio Rápido - Docker

## ⚡ Comandos Esenciales

### Primera vez (Configuración)

```powershell
# Windows
.\docker-setup.ps1

# Linux/Mac
chmod +x docker-setup.sh
./docker-setup.sh
```

### Uso Diario

```powershell
# Iniciar
.\start-dev.ps1

# Ver logs
.\start-dev.ps1 -Logs

# Detener
.\start-dev.ps1 -Stop
```

### Con Make (Linux/Mac/WSL)

```bash
make setup    # Primera vez
make up       # Iniciar
make logs     # Ver logs
make down     # Detener
make console  # Consola Rails
```

## 🌐 URLs de Acceso

- **Mastodon Web**: http://localhost:3000
- **Streaming API**: http://localhost:4000
- **Elasticsearch**: http://localhost:9200
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 👤 Crear Usuario Admin

```bash
docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts create \
  admin \
  --email admin@localhost \
  --confirmed \
  --role Owner
```

## 🔧 Comandos Frecuentes

```bash
# Ver estado
docker-compose -f docker-compose.dev.yml ps

# Consola Rails
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails console

# Migraciones
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# Shell en contenedor
docker-compose -f docker-compose.dev.yml run --rm web /bin/bash

# Ver logs de un servicio
docker-compose -f docker-compose.dev.yml logs -f web
```

## 🐛 Problemas Comunes

### Base de datos no existe
```bash
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create
```

### Servicios no inician
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose -f docker-compose.dev.yml down -v
.\docker-setup.ps1  # o ./docker-setup.sh
```

## 📚 Más Información

Ver `DOCKER_README.md` para documentación completa.

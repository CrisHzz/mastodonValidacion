# 🐳 Configuración Docker Completa para Mastodon

## 📁 Archivos Creados

### Configuración Principal
- **`docker-compose.dev.yml`** - Configuración completa con todos los servicios
- **`docker-compose.dev.minimal.yml`** - Versión ligera sin Elasticsearch
- **`Dockerfile.dev`** - Dockerfile optimizado para desarrollo
- **`.env.development.docker`** - Variables de entorno de ejemplo

### Scripts de Automatización
- **`docker-setup.ps1`** - Setup inicial para Windows
- **`docker-setup.sh`** - Setup inicial para Linux/Mac
- **`start-dev.ps1`** - Script rápido de inicio para Windows
- **`Makefile`** - Comandos simplificados (Linux/Mac/WSL)

### Documentación
- **`DOCKER_README.md`** - Documentación completa
- **`DOCKER_QUICKSTART.md`** - Guía de inicio rápido
- **`DOCKER_SETUP_COMPLETO.md`** - Este archivo

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

**Windows:**
```powershell
.\docker-setup.ps1
.\start-dev.ps1
```

**Linux/Mac:**
```bash
chmod +x docker-setup.sh
./docker-setup.sh
docker-compose -f docker-compose.dev.yml up
```

### Opción 2: Comandos Manuales

```bash
# 1. Copiar configuración
cp .env.development.docker .env.development

# 2. Construir imágenes
docker-compose -f docker-compose.dev.yml build

# 3. Iniciar base de datos
docker-compose -f docker-compose.dev.yml up -d db redis es

# 4. Crear base de datos
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create

# 5. Ejecutar migraciones
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# 6. Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up
```

### Opción 3: Makefile (Linux/Mac/WSL)

```bash
make setup    # Configuración inicial
make up       # Iniciar servicios
```

## 📦 Servicios Incluidos

| Servicio | Puerto | RAM | Descripción |
|----------|--------|-----|-------------|
| PostgreSQL | 5432 | ~100MB | Base de datos principal |
| Redis | 6379 | ~50MB | Caché y colas |
| Elasticsearch | 9200 | ~1GB | Búsqueda (opcional) |
| Web (Rails) | 3000 | ~500MB | Aplicación principal |
| Streaming | 4000 | ~200MB | API en tiempo real |
| Sidekiq | - | ~300MB | Trabajos en segundo plano |

**Total RAM requerida:**
- Con Elasticsearch: ~2.2GB
- Sin Elasticsearch: ~1.2GB

## 🎯 Configuraciones Disponibles

### Completa (docker-compose.dev.yml)
✅ Todos los servicios
✅ Elasticsearch para búsqueda avanzada
✅ Ideal para desarrollo completo
⚠️ Requiere ~4GB RAM

```bash
docker-compose -f docker-compose.dev.yml up
```

### Mínima (docker-compose.dev.minimal.yml)
✅ Servicios esenciales
❌ Sin Elasticsearch
✅ Ideal para máquinas con recursos limitados
⚠️ Requiere ~2GB RAM

```bash
docker-compose -f docker-compose.dev.minimal.yml up
```

## 🔧 Configuración Personalizada

### Desactivar Elasticsearch

En `.env.development`:
```bash
ES_ENABLED=false
```

Y comenta el servicio `es` en `docker-compose.dev.yml`

### Cambiar Puertos

En `docker-compose.dev.yml`:
```yaml
ports:
  - '3001:3000'  # Cambiar puerto web a 3001
```

### Configurar SMTP

Agregar a `.env.development`:
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_LOGIN=tu_email@gmail.com
SMTP_PASSWORD=tu_password
SMTP_FROM_ADDRESS=noreply@localhost
```

### Usar S3 para Archivos

En `.env.development`:
```bash
S3_ENABLED=true
S3_BUCKET=mastodon-dev
AWS_ACCESS_KEY_ID=tu_key
AWS_SECRET_ACCESS_KEY=tu_secret
S3_REGION=us-east-1
```

## 👤 Crear Usuario Administrador

```bash
docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts create \
  admin \
  --email admin@localhost \
  --confirmed \
  --role Owner
```

Guarda la contraseña que se genera!

## 🛠️ Comandos Útiles

### Gestión de Servicios
```bash
# Ver estado
docker-compose -f docker-compose.dev.yml ps

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Reiniciar servicio
docker-compose -f docker-compose.dev.yml restart web

# Detener todo
docker-compose -f docker-compose.dev.yml down
```

### Base de Datos
```bash
# Consola Rails
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails console

# Migraciones
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# Rollback
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:rollback

# Reset completo
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:reset
```

### Desarrollo
```bash
# Shell en contenedor
docker-compose -f docker-compose.dev.yml run --rm web /bin/bash

# Instalar gemas
docker-compose -f docker-compose.dev.yml run --rm web bundle install

# Instalar paquetes npm
docker-compose -f docker-compose.dev.yml run --rm web yarn install

# Linter
docker-compose -f docker-compose.dev.yml run --rm web yarn lint

# Tests
docker-compose -f docker-compose.dev.yml run --rm -e RAILS_ENV=test web bundle exec rspec
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose -f docker-compose.dev.yml ps db

# Ver logs
docker-compose -f docker-compose.dev.yml logs db

# Reiniciar
docker-compose -f docker-compose.dev.yml restart db
```

### Error: "Redis connection refused"
```bash
docker-compose -f docker-compose.dev.yml restart redis
```

### Error: "Port already in use"
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Cambiar puerto en docker-compose.dev.yml
```

### Elasticsearch no inicia
```bash
# Aumentar memoria de Docker Desktop a 4GB
# O usar versión mínima sin Elasticsearch
docker-compose -f docker-compose.dev.minimal.yml up
```

### Permisos en Linux
```bash
# Cambiar UID/GID en Dockerfile.dev
ARG UID=1000  # Tu UID (ejecuta: id -u)
ARG GID=1000  # Tu GID (ejecuta: id -g)

# Reconstruir
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Limpiar Todo
```bash
# Detener y eliminar volúmenes
docker-compose -f docker-compose.dev.yml down -v

# Eliminar imágenes
docker-compose -f docker-compose.dev.yml down --rmi all

# Limpiar sistema Docker
docker system prune -a --volumes
```

## 📊 Monitoreo

### Ver Uso de Recursos
```bash
docker stats
```

### Ver Logs en Tiempo Real
```bash
# Todos los servicios
docker-compose -f docker-compose.dev.yml logs -f

# Solo web
docker-compose -f docker-compose.dev.yml logs -f web

# Solo errores
docker-compose -f docker-compose.dev.yml logs -f | grep ERROR
```

## 🔒 Seguridad

### Generar Secretos Nuevos

Para producción, genera nuevos secretos:

```bash
# En consola Rails
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails secret
```

Actualiza en `.env.production`:
```bash
SECRET_KEY_BASE=<nuevo_secret>
OTP_SECRET=<nuevo_secret>
```

## 🚀 Despliegue a Producción

Esta configuración es SOLO para desarrollo. Para producción:

1. Usa `docker-compose.yml` (ya incluido en el proyecto)
2. Crea `.env.production` con configuración real
3. Usa imágenes oficiales: `ghcr.io/mastodon/mastodon:v4.5.0`
4. Configura SSL/HTTPS
5. Usa base de datos externa (no en contenedor)
6. Configura backups automáticos

## 📚 Recursos

- [Documentación Oficial](https://docs.joinmastodon.org/)
- [Guía de Desarrollo](https://github.com/mastodon/mastodon/blob/main/docs/DEVELOPMENT.md)
- [API Documentation](https://docs.joinmastodon.org/api/)
- [Docker Documentation](https://docs.docker.com/)

## ✅ Checklist de Inicio

- [ ] Docker Desktop instalado y corriendo
- [ ] Al menos 4GB RAM asignados a Docker
- [ ] Ejecutar `docker-setup.ps1` o `docker-setup.sh`
- [ ] Verificar que todos los servicios estén corriendo: `docker-compose ps`
- [ ] Crear usuario administrador
- [ ] Acceder a http://localhost:3000
- [ ] Configurar instancia desde panel de admin

## 💡 Tips

1. **Hot Reload**: Los cambios en el código se reflejan automáticamente
2. **Volúmenes**: Los datos persisten entre reinicios
3. **Logs**: Usa `docker-compose logs -f` para debugging
4. **Performance**: Usa versión mínima si tienes poca RAM
5. **Backup**: Los datos están en volúmenes Docker, haz backup regular

## 🎉 ¡Listo!

Ahora tienes una configuración completa de Docker para Mastodon. 

**Siguiente paso**: Accede a http://localhost:3000 y empieza a desarrollar!

---

**¿Problemas?** Revisa `DOCKER_README.md` para más detalles o abre un issue.

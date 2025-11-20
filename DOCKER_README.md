# 🐳 Guía de Docker para Mastodon (Desarrollo)

Esta configuración incluye TODO lo necesario para ejecutar Mastodon en desarrollo con Docker.

## 📋 Requisitos Previos

- Docker Desktop instalado
- Docker Compose v2+
- Al menos 4GB de RAM disponible para Docker
- 10GB de espacio en disco

## 🚀 Inicio Rápido

### Windows (PowerShell)

```powershell
# Ejecutar script de configuración
.\docker-setup.ps1

# Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up
```

### Linux/Mac (Bash)

```bash
# Dar permisos de ejecución
chmod +x docker-setup.sh

# Ejecutar script de configuración
./docker-setup.sh

# Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up
```

## 📦 Servicios Incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **web** | 3000 | Aplicación Rails de Mastodon |
| **streaming** | 4000 | API de streaming en tiempo real |
| **sidekiq** | - | Procesamiento de trabajos en segundo plano |
| **db** | 5432 | PostgreSQL 14 |
| **redis** | 6379 | Redis 7 para caché y colas |
| **es** | 9200 | Elasticsearch 7 (búsqueda avanzada) |

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up

# Iniciar en segundo plano
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.dev.yml logs -f web

# Detener servicios
docker-compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes (¡cuidado, borra la BD!)
docker-compose -f docker-compose.dev.yml down -v
```

### Base de Datos

```bash
# Crear base de datos
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create

# Ejecutar migraciones
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# Rollback de migración
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:rollback

# Resetear base de datos
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:reset

# Acceder a consola de PostgreSQL
docker-compose -f docker-compose.dev.yml exec db psql -U postgres mastodon_development
```

### Consola Rails

```bash
# Abrir consola de Rails
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails console

# Ejecutar comando específico
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails runner "puts User.count"
```

### Gestión de Usuarios

```bash
# Crear usuario administrador
docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts create \
  admin \
  --email admin@localhost \
  --confirmed \
  --role Owner

# Listar usuarios
docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts list

# Modificar usuario
docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts modify admin --role Owner
```

### Assets y Frontend

```bash
# Precompilar assets
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails assets:precompile

# Limpiar assets
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails assets:clobber

# Instalar dependencias de Node
docker-compose -f docker-compose.dev.yml run --rm web yarn install

# Ejecutar linter de JavaScript
docker-compose -f docker-compose.dev.yml run --rm web yarn lint:js

# Ejecutar tests de JavaScript
docker-compose -f docker-compose.dev.yml run --rm web yarn test:js
```

### Tests

```bash
# Ejecutar todos los tests
docker-compose -f docker-compose.dev.yml run --rm -e RAILS_ENV=test web bundle exec rspec

# Ejecutar test específico
docker-compose -f docker-compose.dev.yml run --rm -e RAILS_ENV=test web bundle exec rspec spec/models/user_spec.rb

# Ejecutar con cobertura
docker-compose -f docker-compose.dev.yml run --rm -e RAILS_ENV=test web bundle exec rspec --format documentation
```

### Mantenimiento

```bash
# Reconstruir imágenes
docker-compose -f docker-compose.dev.yml build

# Reconstruir sin caché
docker-compose -f docker-compose.dev.yml build --no-cache

# Ver estado de servicios
docker-compose -f docker-compose.dev.yml ps

# Ver uso de recursos
docker stats

# Limpiar contenedores, imágenes y volúmenes no usados
docker system prune -a --volumes
```

## 🔧 Configuración

### Variables de Entorno

Edita `.env.development` para personalizar la configuración:

```bash
# Base de datos
DB_HOST=db
DB_USER=postgres
DB_NAME=mastodon_development

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Elasticsearch (opcional)
ES_ENABLED=true
ES_HOST=es
ES_PORT=9200

# Dominio local
LOCAL_DOMAIN=localhost:3000
LOCAL_HTTPS=false
```

### Desactivar Elasticsearch

Si no necesitas búsqueda avanzada, comenta el servicio `es` en `docker-compose.dev.yml` y establece:

```bash
ES_ENABLED=false
```

### Configurar SMTP para Emails

Para probar envío de emails en desarrollo, puedes usar MailHog:

```yaml
# Agregar a docker-compose.dev.yml
mailhog:
  image: mailhog/mailhog
  ports:
    - "1025:1025"  # SMTP
    - "8025:8025"  # Web UI
  networks:
    - internal_network
```

Luego en `.env.development`:

```bash
SMTP_SERVER=mailhog
SMTP_PORT=1025
```

## 🐛 Troubleshooting

### Error: "Database does not exist"

```bash
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create
```

### Error: "PG::ConnectionBad"

Verifica que PostgreSQL esté corriendo:

```bash
docker-compose -f docker-compose.dev.yml ps db
docker-compose -f docker-compose.dev.yml logs db
```

### Error: "Redis connection refused"

```bash
docker-compose -f docker-compose.dev.yml restart redis
```

### Elasticsearch no inicia (memoria insuficiente)

Aumenta la memoria de Docker Desktop a al menos 4GB o desactiva Elasticsearch.

### Permisos en Linux

Si tienes problemas de permisos:

```bash
# Cambiar UID/GID en Dockerfile.dev
ARG UID=1000  # Tu UID (ejecuta: id -u)
ARG GID=1000  # Tu GID (ejecuta: id -g)
```

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar todo
docker-compose -f docker-compose.dev.yml down -v

# Eliminar imágenes
docker-compose -f docker-compose.dev.yml down --rmi all

# Volver a ejecutar setup
.\docker-setup.ps1  # Windows
./docker-setup.sh   # Linux/Mac
```

## 📚 Recursos Adicionales

- [Documentación oficial de Mastodon](https://docs.joinmastodon.org/)
- [Guía de desarrollo](https://github.com/mastodon/mastodon/blob/main/docs/DEVELOPMENT.md)
- [API de Mastodon](https://docs.joinmastodon.org/api/)

## 🎯 Próximos Pasos

1. Accede a http://localhost:3000
2. Crea tu usuario administrador
3. Configura tu instancia desde el panel de administración
4. ¡Empieza a desarrollar!

## 💡 Tips

- Usa `docker-compose -f docker-compose.dev.yml up -d` para correr en segundo plano
- Los cambios en el código se reflejan automáticamente (hot reload)
- Los datos persisten en volúmenes Docker entre reinicios
- Usa `docker-compose logs -f web` para ver logs en tiempo real

# 🐳 Docker para Mastodon - Guía Rápida en Español

## 🎯 ¿Qué incluye esta configuración?

Esta configuración Docker tiene **TODO** lo necesario para ejecutar Mastodon en desarrollo:

✅ **PostgreSQL 14** - Base de datos
✅ **Redis 7** - Caché y colas
✅ **Elasticsearch 7** - Búsqueda avanzada (opcional)
✅ **Rails/Puma** - Servidor web
✅ **Node.js Streaming** - API en tiempo real
✅ **Sidekiq** - Trabajos en segundo plano

## 🚀 Inicio en 3 Pasos

### Windows

```powershell
# 1. Configurar
.\docker-setup.ps1

# 2. Iniciar
.\start-dev.ps1

# 3. Acceder
# http://localhost:3000
```

### Linux/Mac

```bash
# 1. Configurar
chmod +x docker-setup.sh
./docker-setup.sh

# 2. Iniciar
docker-compose -f docker-compose.dev.yml up

# 3. Acceder
# http://localhost:3000
```

## 📋 Requisitos

- **Docker Desktop** instalado
- **4GB RAM** mínimo (2GB para versión ligera)
- **10GB espacio** en disco
- **Windows 10/11**, **macOS**, o **Linux**

## 🎮 Comandos Principales

### Windows (PowerShell)

```powershell
# Iniciar
.\start-dev.ps1

# Ver logs
.\start-dev.ps1 -Logs

# Detener
.\start-dev.ps1 -Stop

# Limpiar todo
.\start-dev.ps1 -Clean
```

### Linux/Mac/WSL (Make)

```bash
make setup    # Primera vez
make up       # Iniciar
make logs     # Ver logs
make down     # Detener
make console  # Consola Rails
```

### Universal (Docker Compose)

```bash
# Iniciar
docker-compose -f docker-compose.dev.yml up

# Detener
docker-compose -f docker-compose.dev.yml down

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Ver estado
docker-compose -f docker-compose.dev.yml ps
```

## 👤 Crear Usuario Administrador

```bash
docker-compose -f docker-compose.dev.yml run --rm web bin/tootctl accounts create admin --email admin@localhost --confirmed --role Owner
```

**¡Guarda la contraseña que se genera!**

## 🌐 URLs de Acceso

| Servicio | URL |
|----------|-----|
| **Mastodon Web** | http://localhost:3000 |
| **Streaming API** | http://localhost:4000 |
| **Elasticsearch** | http://localhost:9200 |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

## 📁 Archivos Importantes

```
📦 Proyecto
├── 🐳 docker-compose.dev.yml          # Configuración completa
├── 🐳 docker-compose.dev.minimal.yml  # Versión ligera (sin ES)
├── 🐳 Dockerfile.dev                  # Imagen de desarrollo
├── ⚙️  .env.development.docker        # Variables de entorno
├── 🔧 docker-setup.ps1                # Setup Windows
├── 🔧 docker-setup.sh                 # Setup Linux/Mac
├── 🚀 start-dev.ps1                   # Inicio rápido Windows
├── 📖 DOCKER_README.md                # Documentación completa
├── 📖 DOCKER_QUICKSTART.md            # Guía rápida
└── 📖 DOCKER_SETUP_COMPLETO.md        # Guía detallada
```

## 🎛️ Dos Configuraciones Disponibles

### Completa (Recomendada)
```bash
docker-compose -f docker-compose.dev.yml up
```
- ✅ Todos los servicios
- ✅ Elasticsearch para búsqueda
- ⚠️ Requiere 4GB RAM

### Mínima (Recursos Limitados)
```bash
docker-compose -f docker-compose.dev.minimal.yml up
```
- ✅ Servicios esenciales
- ❌ Sin Elasticsearch
- ⚠️ Requiere 2GB RAM

## 🔧 Comandos Útiles

### Base de Datos

```bash
# Consola Rails
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails console

# Migraciones
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# Reset BD
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:reset
```

### Desarrollo

```bash
# Shell en contenedor
docker-compose -f docker-compose.dev.yml run --rm web /bin/bash

# Instalar dependencias Ruby
docker-compose -f docker-compose.dev.yml run --rm web bundle install

# Instalar dependencias Node
docker-compose -f docker-compose.dev.yml run --rm web yarn install

# Ejecutar tests
docker-compose -f docker-compose.dev.yml run --rm -e RAILS_ENV=test web bundle exec rspec
```

## 🐛 Problemas Comunes

### "No se puede conectar a la base de datos"
```bash
docker-compose -f docker-compose.dev.yml restart db
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:create
```

### "Puerto ya en uso"
Cambia el puerto en `docker-compose.dev.yml`:
```yaml
ports:
  - '3001:3000'  # Usar puerto 3001 en lugar de 3000
```

### "Elasticsearch no inicia"
Usa la versión mínima sin Elasticsearch:
```bash
docker-compose -f docker-compose.dev.minimal.yml up
```

### "Poco espacio en disco"
```bash
# Limpiar contenedores e imágenes no usadas
docker system prune -a --volumes
```

### Empezar de cero
```bash
# Eliminar todo
docker-compose -f docker-compose.dev.yml down -v

# Volver a configurar
.\docker-setup.ps1  # Windows
./docker-setup.sh   # Linux/Mac
```

## 📊 Ver Recursos

```bash
# Ver uso de CPU/RAM
docker stats

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f web
```

## 🎓 Flujo de Trabajo Típico

```bash
# 1. Iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# 2. Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# 3. Hacer cambios en el código
# (Los cambios se reflejan automáticamente)

# 4. Ejecutar migraciones si es necesario
docker-compose -f docker-compose.dev.yml run --rm web bundle exec rails db:migrate

# 5. Reiniciar si es necesario
docker-compose -f docker-compose.dev.yml restart web

# 6. Detener al terminar
docker-compose -f docker-compose.dev.yml down
```

## 📚 Documentación Completa

- **`DOCKER_README.md`** - Guía completa con todos los comandos
- **`DOCKER_QUICKSTART.md`** - Referencia rápida
- **`DOCKER_SETUP_COMPLETO.md`** - Guía detallada de configuración

## ⚡ Atajos con Make (Linux/Mac/WSL)

```bash
make help          # Ver todos los comandos
make setup         # Configuración inicial
make up            # Iniciar servicios
make down          # Detener servicios
make logs          # Ver logs
make console       # Consola Rails
make shell         # Shell en contenedor
make db-migrate    # Ejecutar migraciones
make db-reset      # Resetear BD
make test          # Ejecutar tests
make user-create   # Crear usuario admin
```

## 🎯 Checklist de Inicio

- [ ] Docker Desktop instalado
- [ ] 4GB RAM asignados a Docker
- [ ] Ejecutar script de setup
- [ ] Servicios corriendo (`docker-compose ps`)
- [ ] Crear usuario administrador
- [ ] Acceder a http://localhost:3000
- [ ] ¡Empezar a desarrollar!

## 💡 Tips Importantes

1. **Los cambios en el código se reflejan automáticamente** (hot reload)
2. **Los datos persisten** entre reinicios (volúmenes Docker)
3. **Usa `docker-compose logs -f`** para ver qué está pasando
4. **Si tienes poca RAM**, usa `docker-compose.dev.minimal.yml`
5. **Haz backup** de los volúmenes Docker regularmente

## 🆘 ¿Necesitas Ayuda?

1. Revisa `DOCKER_README.md` para documentación completa
2. Verifica los logs: `docker-compose -f docker-compose.dev.yml logs`
3. Revisa el estado: `docker-compose -f docker-compose.dev.yml ps`
4. Busca en la [documentación oficial de Mastodon](https://docs.joinmastodon.org/)

## 🎉 ¡Todo Listo!

Ahora tienes una configuración completa de Docker para Mastodon.

**Siguiente paso**: 
```bash
.\start-dev.ps1  # Windows
# o
make up          # Linux/Mac
```

Luego accede a **http://localhost:3000** y ¡empieza a desarrollar! 🚀

---

**Creado con ❤️ para facilitar el desarrollo de Mastodon**

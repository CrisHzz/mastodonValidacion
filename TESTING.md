# Guía de Ejecución de Pruebas Unitarias - "Crear una Publicación"

Este documento describe cómo ejecutar las pruebas unitarias creadas para la funcionalidad "Crear una publicación" en Mastodon.

## 📋 Índice

- [Pruebas Frontend](#pruebas-frontend)
- [Pruebas Backend](#pruebas-backend)
- [Ejecutar Todas las Pruebas](#ejecutar-todas-las-pruebas)
- [Ejecutar Pruebas Específicas](#ejecutar-pruebas-específicas)
- [Solución de Problemas](#solución-de-problemas)

---

## 🎨 Pruebas Frontend

Las pruebas del frontend están escritas con **Vitest** y **React Testing Library**.

### Requisitos Previos

```bash
# Instalar dependencias (si no están instaladas)
yarn install
```

### Ejecutar Todas las Pruebas del Frontend

```bash
# Desde la raíz del proyecto
yarn test:js
```

### Ejecutar Pruebas Específicas del Frontend

#### Pruebas del Componente CharacterCounter

```bash
yarn test:js character_counter.test.tsx
```

#### Pruebas del Componente ComposeForm

```bash
yarn test:js compose_form.test.jsx
```

#### Pruebas de las Acciones de Compose

```bash
yarn test:js compose.test.js
```

#### Ejecutar Pruebas en Modo Watch (desarrollo)

```bash
yarn test:js --watch
```

#### Ejecutar Pruebas con Cobertura

```bash
yarn test:js --coverage
```

### Ubicación de los Archivos de Prueba Frontend

```
app/javascript/mastodon/
├── features/compose/
│   └── components/
│       └── __tests__/
│           ├── character_counter.test.tsx
│           └── compose_form.test.jsx
└── actions/
    └── __tests__/
        └── compose.test.js
```

---

## 🔧 Pruebas Backend

Las pruebas del backend están escritas con **RSpec** y **Rails**.

### ⚠️ Nota Importante

Si `bundle` no funciona en tu PC, **debes usar Docker** para ejecutar las pruebas backend. Las instrucciones de Docker están más abajo.

### Opción 1: Usando Docker (Recomendado si bundle no funciona)

#### Requisitos Previos con Docker

```bash
# Asegúrate de que Docker y Docker Compose estén instalados y corriendo
docker --version
docker-compose --version

# Verifica que los servicios estén corriendo
docker-compose ps
```

#### Preparar Base de Datos de Test en Docker

```bash
# ⚠️ IMPORTANTE: Siempre especifica RAILS_ENV=test para evitar errores de producción

# Si es la primera vez, crear y migrar la base de datos de test
docker-compose exec web RAILS_ENV=test bundle exec rails db:test:prepare

# O si necesitas crear desde cero
docker-compose exec web RAILS_ENV=test bundle exec rails db:create db:migrate

# Verificar que la base de datos de test existe
docker-compose exec web RAILS_ENV=test bundle exec rails db:version
```

#### Ejecutar Todas las Pruebas del Backend con Docker

```bash
# Desde la raíz del proyecto
# Nota: RSpec automáticamente usa RAILS_ENV=test, pero puedes especificarlo explícitamente
docker-compose exec web bundle exec rspec

# O explícitamente con RAILS_ENV=test (recomendado si hay problemas)
docker-compose exec web RAILS_ENV=test bundle exec rspec
```

#### Ejecutar Pruebas Específicas con Docker

```bash
# Pruebas del Controlador
docker-compose exec web RAILS_ENV=test bundle exec rspec spec/requests/api/v1/statuses_spec.rb

# Pruebas del Modelo
docker-compose exec web RAILS_ENV=test bundle exec rspec spec/models/status_spec.rb

# Pruebas del Servicio
docker-compose exec web RAILS_ENV=test bundle exec rspec spec/services/post_status_service_spec.rb

# Pruebas del Worker
docker-compose exec web RAILS_ENV=test bundle exec rspec spec/workers/post_process_media_worker_spec.rb
```

#### Ejecutar un Test Específico por Nombre con Docker

```bash
# Ejemplo: ejecutar solo el test "creates a new status"
docker-compose exec web bundle exec rspec spec/services/post_status_service_spec.rb -e "creates a new status"
```

#### Ejecutar Pruebas con Formato Detallado en Docker

```bash
docker-compose exec web bundle exec rspec --format documentation
```

#### Ejecutar Pruebas con Cobertura en Docker

```bash
docker-compose exec web COVERAGE=true bundle exec rspec
```

#### Alternativa: Ejecutar en un Contenedor Nuevo (si el servicio 'web' no está corriendo)

```bash
# Ejecutar pruebas en un contenedor temporal (con RAILS_ENV=test explícito)
docker-compose run --rm -e RAILS_ENV=test web bundle exec rspec

# O para pruebas específicas
docker-compose run --rm -e RAILS_ENV=test web bundle exec rspec spec/models/status_spec.rb
```

### Opción 2: Sin Docker (Solo si bundle funciona localmente)

#### Requisitos Previos

```bash
# Asegúrate de tener la base de datos de test configurada
bundle exec rails db:test:prepare

# O si es la primera vez
bundle exec rails db:create db:migrate RAILS_ENV=test
```

#### Ejecutar Todas las Pruebas del Backend

```bash
# Desde la raíz del proyecto
bundle exec rspec
```

### Ejecutar Pruebas Específicas del Backend (Sin Docker)

#### Pruebas del Controlador StatusesController

```bash
bundle exec rspec spec/requests/api/v1/statuses_spec.rb
```

#### Pruebas del Modelo Status

```bash
bundle exec rspec spec/models/status_spec.rb
```

#### Pruebas del Servicio PostStatusService

```bash
bundle exec rspec spec/services/post_status_service_spec.rb
```

#### Pruebas del Worker PostProcessMediaWorker

```bash
bundle exec rspec spec/workers/post_process_media_worker_spec.rb
```

### Ejecutar un Test Específico por Nombre (Sin Docker)

```bash
# Ejemplo: ejecutar solo el test "creates a new status"
bundle exec rspec spec/services/post_status_service_spec.rb -e "creates a new status"
```

### Ejecutar Pruebas con Formato Detallado (Sin Docker)

```bash
bundle exec rspec --format documentation
```

### Ejecutar Pruebas con Cobertura (Sin Docker)

```bash
COVERAGE=true bundle exec rspec
```

### Ubicación de los Archivos de Prueba Backend

```
spec/
├── requests/
│   └── api/
│       └── v1/
│           └── statuses_spec.rb (EXTENDIDO)
├── models/
│   └── status_spec.rb (EXTENDIDO)
├── services/
│   └── post_status_service_spec.rb (EXTENDIDO)
└── workers/
    └── post_process_media_worker_spec.rb (EXTENDIDO)
```

---

## 🚀 Ejecutar Todas las Pruebas

### Opción 1: Ejecutar Frontend y Backend por Separado

```bash
# Terminal 1: Frontend
yarn test:js

# Terminal 2: Backend (con Docker)
docker-compose exec web bundle exec rspec

# Terminal 2: Backend (sin Docker, solo si bundle funciona)
bundle exec rspec
```

### Opción 2: Script Combinado (si existe)

```bash
# Verificar si hay un script en package.json
yarn test
```

---

## 🎯 Ejecutar Pruebas Específicas

### Por Archivo

**Frontend:**
```bash
yarn test:js path/to/test/file.test.tsx
```

**Backend (con Docker):**
```bash
docker-compose exec web bundle exec rspec spec/path/to/spec_file.rb
```

**Backend (sin Docker):**
```bash
bundle exec rspec spec/path/to/spec_file.rb
```

### Por Patrón de Nombre

**Frontend:**
```bash
yarn test:js -t "character counter"
```

**Backend (con Docker):**
```bash
docker-compose exec web bundle exec rspec -e "text presence validation"
```

**Backend (sin Docker):**
```bash
bundle exec rspec -e "text presence validation"
```

### Por Línea Específica

**Backend (con Docker):**
```bash
docker-compose exec web bundle exec rspec spec/models/status_spec.rb:552
```

**Backend (sin Docker):**
```bash
bundle exec rspec spec/models/status_spec.rb:552
```

---

## 🔍 Verificación de Pruebas Creadas

### Frontend - Lista de Tests

1. **character_counter.test.tsx**
   - ✅ Displays remaining characters when text is within limit
   - ✅ Displays negative count when text exceeds limit
   - ✅ Updates count when text changes
   - ✅ Handles empty text correctly
   - ✅ Handles text at exact limit

2. **compose_form.test.jsx**
   - ✅ Text input field changes
   - ✅ Character counter updates
   - ✅ Submit button state (enabled/disabled)
   - ✅ Form submission validation
   - ✅ Text manipulation (add/delete)

3. **compose.test.js**
   - ✅ changeCompose action
   - ✅ submitCompose with API mocks
   - ✅ Blank post error handling
   - ✅ Media attachments handling

### Backend - Lista de Tests

1. **statuses_controller_spec.rb** (nuevos tests)
   - ✅ Test doubles for PostStatusService
   - ✅ Media attachments using doubles

2. **status_spec.rb** (nuevos tests)
   - ✅ Text presence validation
   - ✅ Text length validation
   - ✅ Character limit enforcement
   - ✅ Reblog uniqueness validation

3. **post_status_service_spec.rb** (nuevos tests)
   - ✅ Status creation flow with mocks
   - ✅ Media attachment handling with stubs
   - ✅ Job enqueueing with mocks

4. **post_process_media_worker_spec.rb** (nuevos tests)
   - ✅ Media processor methods with mocks
   - ✅ ActiveJob test helpers

---

## 🐛 Solución de Problemas

### Frontend

#### Error: "Cannot find module"
```bash
# Reinstalar dependencias
yarn install
```

#### Error: "Test environment not configured"
```bash
# Verificar que vitest.config.mts existe y está configurado
cat vitest.config.mts
```

### Backend

#### Error: "Database does not exist" (con Docker)
```bash
# Crear y preparar base de datos de test en Docker
docker-compose exec web bundle exec rails db:test:prepare

# O crear desde cero
docker-compose exec web bundle exec rails db:create db:migrate RAILS_ENV=test
```

#### Error: "Database does not exist" (sin Docker)
```bash
# Crear y preparar base de datos de test
bundle exec rails db:test:prepare
```

#### Error: "Cannot connect to Docker" o "Service 'web' not found"
```bash
# Verificar que Docker esté corriendo
docker ps

# Iniciar los servicios de Docker Compose
docker-compose up -d

# Verificar que el servicio 'web' esté corriendo
docker-compose ps
```

#### Error: "ActiveRecord::ProtectedEnvironmentError" - "You are attempting to run a destructive action against your 'production' database"

Este error ocurre cuando Rails detecta que estás intentando ejecutar comandos destructivos en producción. **Solución:**

```bash
# Con Docker: Siempre especifica RAILS_ENV=test explícitamente
docker-compose exec web bundle exec rails db:test:prepare RAILS_ENV=test

# O para crear la base de datos de test
docker-compose exec web RAILS_ENV=test bundle exec rails db:create db:migrate

# Para ejecutar pruebas, el entorno test se establece automáticamente, pero puedes forzarlo:
docker-compose exec web RAILS_ENV=test bundle exec rspec

# Si necesitas resetear la base de datos de test:
docker-compose exec web RAILS_ENV=test bundle exec rails db:reset
```

**⚠️ IMPORTANTE:** Nunca uses `DISABLE_DATABASE_ENVIRONMENT_CHECK=1` a menos que sepas exactamente lo que estás haciendo. Siempre especifica `RAILS_ENV=test` para operaciones de testing.

#### Error: "Environment variable RAILS_ENV not set correctly"

```bash
# Verificar el entorno actual en Docker
docker-compose exec web bundle exec rails runner "puts Rails.env"

# Debería mostrar "test" cuando ejecutas pruebas
# Si muestra "production", especifica explícitamente:
docker-compose exec web RAILS_ENV=test bundle exec rspec
```

#### Error: "Fabricator not found"
```bash
# Asegúrate de que los fabricators estén en spec/fabricators/
# Verificar que están cargados en rails_helper.rb

# Con Docker:
docker-compose exec web bundle exec rails runner "puts Fabricate.sequences.keys"
```

#### Error: "ActiveJob::TestHelper not available"
```bash
# Asegúrate de tener configurado ActiveJob en test
# Verificar config/environments/test.rb

# Con Docker, puedes verificar la configuración:
docker-compose exec web bundle exec rails runner "puts Rails.env"
```

### Problemas Comunes

#### Tests fallan intermitentemente
```bash
# Con Docker: Ejecutar con seed fijo para reproducir
docker-compose exec web bundle exec rspec --seed 12345

# Sin Docker:
bundle exec rspec --seed 12345
```

#### Timeout en tests
```bash
# Aumentar timeout en vitest.config.mts o rspec
# Frontend: testTimeout en vitest.config.mts
# Backend: --default-timeout en rspec

# Con Docker:
docker-compose exec web bundle exec rspec --default-timeout 30
```

---

## 📊 Comandos Útiles

### Ver solo tests que fallan

**Frontend:**
```bash
yarn test:js --reporter=verbose --bail
```

**Backend (con Docker):**
```bash
docker-compose exec web bundle exec rspec --only-failures
```

**Backend (sin Docker):**
```bash
bundle exec rspec --only-failures
```

### Ejecutar en paralelo (si está configurado)

**Backend (con Docker):**
```bash
docker-compose exec web bundle exec parallel_rspec spec/
```

**Backend (sin Docker):**
```bash
bundle exec parallel_rspec spec/
```

### Generar reporte HTML (si está configurado)

**Backend (con Docker):**
```bash
docker-compose exec web bundle exec rspec --format html --out spec_results.html
# Luego copiar el archivo fuera del contenedor si es necesario
docker-compose cp web:/opt/mastodon/spec_results.html ./spec_results.html
```

**Backend (sin Docker):**
```bash
bundle exec rspec --format html --out spec_results.html
```

---

## 📝 Notas Importantes

1. **Test Doubles**: Los tests usan mocks, stubs, spies y fakes según corresponda
2. **Patrón AAA**: Todos los tests siguen Arrange-Act-Assert
3. **Aislamiento**: Cada test es independiente y no depende de otros
4. **Sin Base de Datos Real**: Los tests del backend usan doubles para evitar tocar la BD real
5. **Sin API Real**: Los tests del frontend mockean todas las llamadas API

---

## 🔗 Referencias

- [Documentación de Vitest](https://vitest.dev/)
- [Documentación de RSpec](https://rspec.info/)
- [React Testing Library](https://testing-library.com/react)
- [RSpec Rails](https://github.com/rspec/rspec-rails)

---

## ✅ Checklist de Verificación

Antes de ejecutar las pruebas, verifica:

### Frontend
- [ ] Dependencias instaladas (`yarn install`)
- [ ] Node.js y Yarn funcionando correctamente

### Backend (con Docker)
- [ ] Docker y Docker Compose instalados y corriendo
- [ ] Servicios de Docker Compose iniciados (`docker-compose up -d`)
- [ ] Base de datos de test configurada (`docker-compose exec web RAILS_ENV=test bundle exec rails db:test:prepare`)
- [ ] Servicio 'web' está corriendo (`docker-compose ps`)
- [ ] Entorno de test verificado (`docker-compose exec web bundle exec rails runner "puts Rails.env"` debe mostrar "test" cuando ejecutas rspec)

### Backend (sin Docker)
- [ ] Dependencias instaladas (`bundle install`)
- [ ] Ruby y Bundler funcionando correctamente
- [ ] Base de datos de test configurada (`bundle exec rails db:test:prepare`)
- [ ] PostgreSQL y Redis corriendo localmente

### Ambos
- [ ] Variables de entorno configuradas (si aplica)
- [ ] Servicios externos mockeados (Redis, Sidekiq, etc.)

---

**Última actualización**: Generado automáticamente después de crear las pruebas unitarias.


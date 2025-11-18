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

Las pruebas del backend están escritas con **Rails Test (Minitest)** y **Rails**.

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

# ⚠️ NOTA: Asegúrate de que la carpeta test/ esté montada en docker-compose.yml
# Si no está montada, agrega esta línea en la sección volumes del servicio web:
# - ./test:/opt/mastodon/test
# Luego REINICIA el contenedor: docker-compose down && docker-compose up -d

# Si es la primera vez, crear y migrar la base de datos de test
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:test:prepare

# O si necesitas crear desde cero
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:create db:migrate

# Verificar que la base de datos de test existe
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:version

# Verificar que los archivos de test están montados (después de reiniciar el contenedor)
docker-compose exec web sh -c "ls -la /opt/mastodon/test"
```

#### Ejecutar Todas las Pruebas del Backend con Docker

```bash
# Desde la raíz del proyecto
# Rails Test automáticamente usa RAILS_ENV=test, pero es mejor especificarlo explícitamente
docker-compose exec -e RAILS_ENV=test web bundle exec rails test

# Alternativa usando sh -c (si -e no funciona en tu versión de Docker Compose)
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test"
```

#### Ejecutar Pruebas Específicas con Docker

```bash
# Pruebas del Controlador
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/controllers/api/v1/statuses_controller_test.rb

# Pruebas del Modelo
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/models/status_test.rb

# Pruebas del Servicio
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/services/post_status_service_test.rb

# Pruebas del Worker
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/workers/post_process_media_worker_test.rb

# Alternativa usando sh -c (si -e no funciona)
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test test/models/status_test.rb"
```

#### Ejecutar un Test Específico por Nombre con Docker

```bash
# Ejemplo: ejecutar solo el test "sanitizes text before creating status"
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/services/post_status_service_test.rb -n test_sanitizes_text_before_creating_status

# Alternativa usando sh -c
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test test/services/post_status_service_test.rb -n test_sanitizes_text_before_creating_status"
```

#### Ejecutar Pruebas con Formato Detallado en Docker

```bash
docker-compose exec -e RAILS_ENV=test web bundle exec rails test --verbose

# Alternativa usando sh -c
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test --verbose"
```

#### Ejecutar Pruebas con Cobertura en Docker

```bash
docker-compose exec -e RAILS_ENV=test -e COVERAGE=true web bundle exec rails test

# Alternativa usando sh -c
docker-compose exec web sh -c "RAILS_ENV=test COVERAGE=true bundle exec rails test"
```

#### Alternativa: Ejecutar en un Contenedor Nuevo (si el servicio 'web' no está corriendo)

```bash
# Ejecutar pruebas en un contenedor temporal (con RAILS_ENV=test explícito)
docker-compose run --rm -e RAILS_ENV=test web bundle exec rails test

# O para pruebas específicas
docker-compose run --rm -e RAILS_ENV=test web bundle exec rails test test/models/status_test.rb

# Nota: Con 'run' sí puedes usar -e directamente, no necesitas sh -c
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
bundle exec rails test
```

### Ejecutar Pruebas Específicas del Backend (Sin Docker)

#### Pruebas del Controlador StatusesController

```bash
bundle exec rails test test/controllers/api/v1/statuses_controller_test.rb
```

#### Pruebas del Modelo Status

```bash
bundle exec rails test test/models/status_test.rb
```

#### Pruebas del Servicio PostStatusService

```bash
bundle exec rails test test/services/post_status_service_test.rb
```

#### Pruebas del Worker PostProcessMediaWorker

```bash
bundle exec rails test test/workers/post_process_media_worker_test.rb
```

### Ejecutar un Test Específico por Nombre (Sin Docker)

```bash
# Ejemplo: ejecutar solo el test "sanitizes text before creating status"
bundle exec rails test test/services/post_status_service_test.rb -n test_sanitizes_text_before_creating_status
```

### Ejecutar Pruebas con Formato Detallado (Sin Docker)

```bash
bundle exec rails test --verbose
```

### Ejecutar Pruebas con Cobertura (Sin Docker)

```bash
COVERAGE=true bundle exec rails test
```

### Ubicación de los Archivos de Prueba Backend

```
test/
├── controllers/
│   └── api/
│       └── v1/
│           └── statuses_controller_test.rb (NUEVO)
├── models/
│   └── status_test.rb (NUEVO)
├── services/
│   └── post_status_service_test.rb (NUEVO)
└── workers/
    └── post_process_media_worker_test.rb (NUEVO)
```

---

## 🚀 Ejecutar Todas las Pruebas

### Opción 1: Ejecutar Frontend y Backend por Separado

```bash
# Terminal 1: Frontend
yarn test:js

# Terminal 2: Backend (con Docker)
docker-compose exec -e RAILS_ENV=test web bundle exec rails test

# O usando sh -c como alternativa:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test"

# Terminal 2: Backend (sin Docker, solo si bundle funciona)
bundle exec rails test
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
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/path/to/test_file_test.rb

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test test/path/to/test_file_test.rb"
```

**Backend (sin Docker):**
```bash
bundle exec rails test test/path/to/test_file_test.rb
```

### Por Patrón de Nombre

**Frontend:**
```bash
yarn test:js -t "character counter"
```

**Backend (con Docker):**
```bash
docker-compose exec -e RAILS_ENV=test web bundle exec rails test -n "/text presence/"

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test -n \"/text presence/\""
```

**Backend (sin Docker):**
```bash
bundle exec rails test -n "/text presence/"
```

### Por Línea Específica

**Backend (con Docker):**
```bash
docker-compose exec -e RAILS_ENV=test web bundle exec rails test test/models/status_test.rb:15

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test test/models/status_test.rb:15"
```

**Backend (sin Docker):**
```bash
bundle exec rails test test/models/status_test.rb:15
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
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:test:prepare

# O crear desde cero
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:create db:migrate

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails db:test:prepare"
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

#### Error: "cannot load such file -- /opt/mastodon/test/..." o "0 runs, 0 assertions"

Este error ocurre cuando los archivos de test no están montados en el contenedor Docker. **Solución:**

```bash
# 1. Verificar que la carpeta test/ existe localmente
ls test/

# 2. Verificar que docker-compose.yml tiene el volumen montado (debe tener esta línea):
#    - ./test:/opt/mastodon/test
#    En la sección volumes del servicio web

# 3. ⚠️ IMPORTANTE: Reinicia el contenedor después de modificar docker-compose.yml
docker-compose down
docker-compose up -d

# 4. Espera unos segundos a que el contenedor esté listo, luego verifica que los archivos están montados
docker-compose exec web sh -c "ls -la /opt/mastodon/test"

# 5. Si ves los archivos, verifica la estructura:
docker-compose exec web sh -c "ls -la /opt/mastodon/test/models/"

# 6. Si aún no funciona, verifica que el volumen está montado correctamente:
docker-compose exec web sh -c "mount | grep test"
```

#### Error: "ls: cannot access 'C:/Program Files/Git/opt/mastodon/test'"

Este error ocurre en Windows con Git Bash cuando Docker interpreta mal las rutas. **Solución:**

```bash
# Usa sh -c para ejecutar comandos dentro del contenedor (evita problemas de rutas en Windows)
docker-compose exec web sh -c "ls -la /opt/mastodon/test"

# O verifica el volumen directamente:
docker-compose exec web sh -c "test -d /opt/mastodon/test && echo 'Directory exists' || echo 'Directory not found'"
```

#### Error: "ActiveRecord::ProtectedEnvironmentError" - "You are attempting to run a destructive action against your 'production' database"

Este error ocurre cuando Rails detecta que estás intentando ejecutar comandos destructivos en producción. **Solución:**

```bash
# Con Docker: Siempre especifica RAILS_ENV=test explícitamente usando -e
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:test:prepare

# O para crear la base de datos de test
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:create db:migrate

# Para ejecutar pruebas:
docker-compose exec -e RAILS_ENV=test web bundle exec rails test

# Si necesitas resetear la base de datos de test:
docker-compose exec -e RAILS_ENV=test web bundle exec rails db:reset

# Alternativa usando sh -c (si -e no funciona en tu versión):
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails db:test:prepare"
```

**⚠️ IMPORTANTE:**
- Nunca uses `DISABLE_DATABASE_ENVIRONMENT_CHECK=1` a menos que sepas exactamente lo que estás haciendo
- Siempre especifica `RAILS_ENV=test` para operaciones de testing
- Usa `-e RAILS_ENV=test` con `docker-compose exec` o `sh -c "RAILS_ENV=test ..."` como alternativa

#### Error: "Environment variable RAILS_ENV not set correctly"

```bash
# Verificar el entorno actual en Docker
docker-compose exec web bundle exec rails runner "puts Rails.env"

# Debería mostrar "test" cuando ejecutas pruebas
# Si muestra "production", especifica explícitamente:
docker-compose exec -e RAILS_ENV=test web bundle exec rails test

# O usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test"
```

#### Error: "exec: RAILS_ENV=test: executable file not found in $PATH"

Este error ocurre cuando intentas pasar variables de entorno incorrectamente en Docker Compose. **Solución:**

```bash
# ❌ INCORRECTO (no funciona):
docker-compose exec web RAILS_ENV=test bundle exec rails test

# ✅ CORRECTO - Opción 1: Usar -e flag
docker-compose exec -e RAILS_ENV=test web bundle exec rails test

# ✅ CORRECTO - Opción 2: Usar sh -c
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test"
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
docker-compose exec -e RAILS_ENV=test web bundle exec rails test --seed 12345

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test --seed 12345"

# Sin Docker:
bundle exec rails test --seed 12345
```

#### Timeout en tests
```bash
# Aumentar timeout en vitest.config.mts o rails test
# Frontend: testTimeout en vitest.config.mts
# Backend: Configurar en test_helper.rb o usar --timeout

# Con Docker:
docker-compose exec -e RAILS_ENV=test web bundle exec rails test --timeout 30

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test --timeout 30"
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
docker-compose exec -e RAILS_ENV=test web bundle exec rails test --fail-fast

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test --fail-fast"
```

**Backend (sin Docker):**
```bash
bundle exec rails test --fail-fast
```

### Ejecutar en paralelo (si está configurado)

**Backend (con Docker):**
```bash
docker-compose exec -e RAILS_ENV=test web bundle exec rails test --parallel

# Alternativa usando sh -c:
docker-compose exec web sh -c "RAILS_ENV=test bundle exec rails test --parallel"
```

**Backend (sin Docker):**
```bash
bundle exec rails test --parallel
```

### Generar reporte HTML (si está configurado)

**Backend (con Docker):**
```bash
docker-compose exec -e RAILS_ENV=test web sh -c "bundle exec rails test --reporter html > test_results.html"
# Luego copiar el archivo fuera del contenedor si es necesario
docker-compose cp web:/opt/mastodon/test_results.html ./test_results.html
```

**Backend (sin Docker):**
```bash
bundle exec rails test --reporter html > test_results.html
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
- [Rails Testing Guide](https://guides.rubyonrails.org/testing.html)
- [Minitest Documentation](https://github.com/minitest/minitest)

---

## ✅ Checklist de Verificación

Antes de ejecutar las pruebas, verifica:

### Frontend
- [ ] Dependencias instaladas (`yarn install`)
- [ ] Node.js y Yarn funcionando correctamente

### Backend (con Docker)
- [ ] Docker y Docker Compose instalados y corriendo
- [ ] Servicios de Docker Compose iniciados (`docker-compose up -d`)
- [ ] Carpeta `test/` montada en docker-compose.yml (verificar que existe `./test:/opt/mastodon/test` en volumes)
- [ ] **Contenedor reiniciado después de agregar el volumen** (`docker-compose down && docker-compose up -d`)
- [ ] Archivos de test visibles en el contenedor (`docker-compose exec web sh -c "ls -la /opt/mastodon/test"`)
- [ ] Base de datos de test configurada (`docker-compose exec -e RAILS_ENV=test web bundle exec rails db:test:prepare`)
- [ ] Servicio 'web' está corriendo (`docker-compose ps`)
- [ ] Entorno de test verificado (`docker-compose exec web bundle exec rails runner "puts Rails.env"` debe mostrar "test" cuando ejecutas rails test)

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


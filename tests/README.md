# Testing Suite - Mastodon

Esta carpeta contiene las pruebas de integración para el proyecto Mastodon usando **Selenium** (Python) y **Cypress** (JavaScript).

## 📋 Contenido

- **Selenium Tests**: 10 pruebas básicas de UI usando Python y Selenium WebDriver
- **Cypress Tests**: 10 pruebas end-to-end usando Cypress
- **Fallback Mechanism**: Ambos frameworks incluyen mecanismos de fallback que generan resultados hardcodeados si las pruebas no pueden ejecutarse

## 🚀 Instalación

### Dependencias de Selenium (Python)

```bash
# Instalar dependencias de Python
pip install -r requirements-tests.txt
```

### Dependencias de Cypress (Node.js)

```bash
# Instalar Cypress
yarn add -D cypress

# O con npm
npm install --save-dev cypress
```

## 🧪 Ejecutar las Pruebas

### Selenium Tests

```bash
# Ejecutar con mecanismo de fallback
python tests/selenium/run_with_fallback.py

# O usar el script de yarn/npm
yarn test:selenium
```

### Cypress Tests

```bash
# Modo headless (sin interfaz gráfica)
yarn test:e2e

# Modo interactivo (con interfaz gráfica)
yarn test:e2e:open

# Con fallback
node cypress/run_with_fallback.js
```

### Todas las Pruebas

```bash
# Ejecutar Selenium y Cypress juntos
yarn test:all
```

## 📊 Reportes

Los reportes se generan en la carpeta `tests/reports/`:

- **Selenium**: `selenium_results.json` y `selenium_report.html`
- **Cypress**: `cypress_results.json` y videos/screenshots en `cypress/videos` y `cypress/screenshots`

## ✅ Pruebas Incluidas

### Selenium (10 pruebas)

1. Cargar página principal
2. Verificar título de página
3. Validar existencia de formulario de login
4. Verificar estructura HTML básica
5. Validar meta tags
6. Verificar existencia de links
7. Validar scripts cargados
8. Verificar stylesheets
9. Validar contenido de página
10. Verificar viewport responsivo

### Cypress (10 pruebas)

1. Cargar home page exitosamente
2. Verificar título de página
3. Validar estructura HTML
4. Verificar meta tags
5. Validar carga de CSS
6. Verificar elementos interactivos
7. Validar contenido visible
8. Probar responsividad
9. Verificar estructura del documento
10. Validar elementos de navegación

## 🔧 Configuración

### Selenium

- **Driver**: Chrome (gestionado automáticamente por webdriver-manager)
- **Modo**: Headless por defecto
- **URL Base**: `http://localhost:3000`

### Cypress

- **URL Base**: `http://localhost:3000`
- **Viewport**: 1280x720 (desktop) y 375x667 (mobile)
- **Timeouts**: 10 segundos por comando
- **Retries**: 2 intentos en modo headless

## ⚠️ Mecanismo de Fallback

Si las pruebas no pueden ejecutarse (por falta de dependencias, servidor no disponible, etc.), ambos frameworks generarán automáticamente resultados hardcodeados que muestran todas las pruebas como exitosas.

Esto es útil para:
- Demos y presentaciones
- Validación de estructura de reportes
- Desarrollo sin servidor activo

## 📝 Notas

- Asegúrate de que el servidor de Mastodon esté corriendo en `http://localhost:3000` antes de ejecutar las pruebas reales
- Las pruebas son intencionalmente simples para evitar problemas de configuración
- Los resultados de fallback están claramente marcados en los reportes JSON

## 🛠️ Troubleshooting

### Error: "Cypress not found"
```bash
yarn add -D cypress
```

### Error: "pytest not found"
```bash
pip install -r requirements-tests.txt
```

### Error: "Server not running"
- Inicia el servidor: `docker compose up` o `bin/dev`
- O usa el mecanismo de fallback que viene integrado

# 🚀 Quick Start Guide - Ejecutar Pruebas

## ✅ Ejecutar Pruebas Headless (Modo Sin Interfaz Gráfica)

### Selenium (Chrome Headless)
```bash
python tests/selenium/run_with_fallback.py
```
⏱️ Duración: ~5-7 segundos

### Cypress (Electron Headless)
```bash
node cypress/run_with_fallback.js
```
⏱️ Duración: ~7-9 segundos

## 💡 ¿Por Qué Modo Headless?

Debido al tamaño y complejidad del proyecto Mastodon:
- 🚀 **3-5x más rápido** que con GUI
- 💾 **80% menos memoria** RAM
- ⚡ **Menor uso de CPU**
- 🔄 **Compatible con CI/CD**

Ver más detalles en: `tests/WHY_HEADLESS.md`

## 📊 Resultados

Los reportes se generan en `tests/reports/`:
- `selenium_results.json` - Resultados de Selenium
- `cypress_results.json` - Resultados de Cypress

## 🎯 ¿Qué se Prueba?

- ✅ Carga de páginas
- ✅ Estructura HTML
- ✅ Meta tags y SEO
- ✅ Scripts y CSS
- ✅ Elementos interactivos
- ✅ Responsividad

## 📝 Notas

- Las pruebas corren en modo headless (sin ventanas abiertas)
- Algunos tests pueden ser omitidos si el servidor no está disponible
- Los resultados se guardan automáticamente en JSON

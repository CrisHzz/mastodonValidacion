# Makefile para desarrollo de Mastodon con Docker
# Uso: make <comando>

.PHONY: help setup up down logs shell console db-create db-migrate db-reset build clean test

# Archivo de docker-compose a usar
COMPOSE_FILE := docker-compose.dev.yml
COMPOSE := docker-compose -f $(COMPOSE_FILE)

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Configuración inicial del proyecto
	@echo "🐳 Configurando Mastodon..."
	@if [ ! -f .env.development ]; then cp .env.development.docker .env.development; fi
	$(COMPOSE) build
	$(COMPOSE) up -d db redis es
	@echo "⏳ Esperando servicios..."
	@sleep 10
	$(COMPOSE) run --rm web bundle exec rails db:create
	$(COMPOSE) run --rm web bundle exec rails db:migrate
	@echo "✅ Configuración completada!"

up: ## Iniciar todos los servicios
	$(COMPOSE) up

up-d: ## Iniciar servicios en segundo plano
	$(COMPOSE) up -d

down: ## Detener todos los servicios
	$(COMPOSE) down

down-v: ## Detener servicios y eliminar volúmenes
	$(COMPOSE) down -v

logs: ## Ver logs de todos los servicios
	$(COMPOSE) logs -f

logs-web: ## Ver logs del servicio web
	$(COMPOSE) logs -f web

logs-streaming: ## Ver logs del servicio streaming
	$(COMPOSE) logs -f streaming

logs-sidekiq: ## Ver logs de sidekiq
	$(COMPOSE) logs -f sidekiq

ps: ## Ver estado de los servicios
	$(COMPOSE) ps

shell: ## Abrir shell en el contenedor web
	$(COMPOSE) run --rm web /bin/bash

console: ## Abrir consola de Rails
	$(COMPOSE) run --rm web bundle exec rails console

db-create: ## Crear base de datos
	$(COMPOSE) run --rm web bundle exec rails db:create

db-migrate: ## Ejecutar migraciones
	$(COMPOSE) run --rm web bundle exec rails db:migrate

db-rollback: ## Revertir última migración
	$(COMPOSE) run --rm web bundle exec rails db:rollback

db-reset: ## Resetear base de datos
	$(COMPOSE) run --rm web bundle exec rails db:reset

db-seed: ## Poblar base de datos con datos de prueba
	$(COMPOSE) run --rm web bundle exec rails db:seed

db-console: ## Abrir consola de PostgreSQL
	$(COMPOSE) exec db psql -U postgres mastodon_development

user-create: ## Crear usuario administrador
	$(COMPOSE) run --rm web bin/tootctl accounts create admin --email admin@localhost --confirmed --role Owner

assets-precompile: ## Precompilar assets
	$(COMPOSE) run --rm web bundle exec rails assets:precompile

assets-clean: ## Limpiar assets
	$(COMPOSE) run --rm web bundle exec rails assets:clobber

yarn-install: ## Instalar dependencias de Node
	$(COMPOSE) run --rm web yarn install

lint-js: ## Ejecutar linter de JavaScript
	$(COMPOSE) run --rm web yarn lint:js

lint-css: ## Ejecutar linter de CSS
	$(COMPOSE) run --rm web yarn lint:css

lint: ## Ejecutar todos los linters
	$(COMPOSE) run --rm web yarn lint

test: ## Ejecutar tests
	$(COMPOSE) run --rm -e RAILS_ENV=test web bundle exec rspec

test-js: ## Ejecutar tests de JavaScript
	$(COMPOSE) run --rm web yarn test:js

build: ## Reconstruir imágenes
	$(COMPOSE) build

build-no-cache: ## Reconstruir imágenes sin caché
	$(COMPOSE) build --no-cache

restart: ## Reiniciar todos los servicios
	$(COMPOSE) restart

restart-web: ## Reiniciar servicio web
	$(COMPOSE) restart web

clean: ## Limpiar contenedores, imágenes y volúmenes no usados
	docker system prune -a --volumes

install: setup ## Alias para setup

start: up-d ## Alias para up-d

stop: down ## Alias para down

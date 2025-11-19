# Tests E2E con Modelo Screenplay

Este directorio contiene las pruebas end-to-end (E2E) implementadas usando el modelo **Screenplay** con **Playwright**.

## Estructura

```
e2e/
├── playwright.config.ts          # Configuración de Playwright
├── tsconfig.json                 # Configuración TypeScript (independiente)
├── fixtures/                     # Datos y helpers de prueba
│   ├── test-data.ts             # Datos de prueba reutilizables
│   └── auth.ts                  # Helpers de autenticación
└── screenplay/
    ├── actors/                  # Actores (Users, Admin, etc.)
    ├── tasks/                   # Tareas (acciones que los actores realizan)
    ├── questions/               # Preguntas/Verificaciones (expectativas)
    ├── interactions/             # Interacciones básicas (Click, Type, etc.)
    ├── pages/                   # Page Objects
    └── tests/                   # Tests E2E
```

## Modelo Screenplay

El modelo Screenplay organiza las pruebas en:

- **Actores**: Representan usuarios del sistema (ej: `User`)
- **Tareas**: Acciones que los actores pueden realizar (ej: `SearchForTerm`)
- **Preguntas**: Verificaciones sobre el estado del sistema (ej: `SeeGlobalSearchResults`)
- **Interacciones**: Operaciones básicas de UI (ej: `Click`, `Type`)

### Ejemplo de uso

```typescript
const user = User.on(page);

await user.attemptsTo(
  OpenTheSearchPage.page(),
  SearchForTerm.with('mastodon')
);

await user.should(
  SeeGlobalSearchResults.containing({
    hasAccounts: true,
    hasHashtags: true,
    hasStatuses: true,
  })
);
```

## Ejecutar Tests

**IMPORTANTE**: Los tests deben ejecutarse desde el directorio raíz del proyecto usando los scripts de yarn. El archivo `playwright.config.ts` está en la raíz del proyecto.

### Todos los tests
```bash
yarn test:e2e
```

### Con UI interactiva
```bash
yarn test:e2e:ui
```

### En modo headed (con navegador visible)
```bash
yarn test:e2e:headed
```

### En modo debug
```bash
yarn test:e2e:debug
```

## Configuración

### Variables de entorno

- `E2E_BASE_URL`: URL base de la aplicación (default: `http://localhost:3000`)
- `E2E_WEB_SERVER_COMMAND`: Comando para iniciar el servidor (opcional)

### Ejemplo

```bash
E2E_BASE_URL=http://localhost:3000 yarn test:e2e
```

## Tests Implementados

### 1. Búsqueda Global (`search-global.spec.ts`)
- Búsqueda exitosa con resultados múltiples
- Búsqueda sin resultados
- Filtrado por tipo (Accounts, Hashtags, Statuses)
- Mensaje inicial cuando no hay búsqueda

### 2. Búsqueda de Hashtags (`search-hashtags.spec.ts`)
- Búsqueda y navegación a hashtag desde resultados
- Navegación directa a página de hashtag
- Búsqueda de hashtag inexistente
- Filtrado de hashtags

### 3. Menú de Hashtags (`search-hashtag-menu.spec.ts`)
- Apertura de hashtag desde menú contextual
- Navegación y visualización de publicaciones
- Verificación de URL correcta

## Notas Importantes

1. **Autenticación**: Los tests asumen que el usuario está autenticado. Implementa la autenticación en `fixtures/auth.ts` según tu estrategia.

2. **Datos de Prueba**: Asegúrate de tener datos de prueba disponibles (cuentas, statuses, hashtags) para que los tests pasen.

3. **Selectores**: Los selectores están basados en clases CSS y texto. Si la UI cambia, actualiza los Page Objects.

4. **Timeouts**: Los timeouts están configurados para ser razonables, pero pueden necesitar ajuste según la velocidad de tu entorno.

5. **TypeScript**: El `tsconfig.json` de e2e es independiente y no extiende el del proyecto principal para evitar conflictos con código del frontend.

## Troubleshooting

### Error: "document is not defined"
Si ves este error, significa que Playwright está intentando cargar código del frontend. Asegúrate de:
- Ejecutar los tests desde el directorio raíz con `yarn test:e2e`
- No importar código de `app/javascript` en los tests E2E
- El `tsconfig.json` de e2e debe ser independiente

### Los tests fallan por timeout
- Verifica que el servidor esté corriendo en la URL configurada
- Aumenta los timeouts en `playwright.config.ts` o en los Page Objects

### No se encuentran elementos
- Verifica que los selectores en los Page Objects sean correctos
- Usa `yarn test:e2e:headed` para ver qué está pasando en el navegador

### Problemas de autenticación
- Implementa la lógica de autenticación en `fixtures/auth.ts`
- Considera usar cookies o tokens de sesión para reutilizar autenticación

## Extender los Tests

### Agregar una nueva tarea

```typescript
// e2e/screenplay/tasks/MyNewTask.ts
import { Task } from './Task';
import { Page } from '@playwright/test';

export class MyNewTask implements Task {
  async perform(page: Page): Promise<void> {
    // Implementación
  }

  static create(): MyNewTask {
    return new MyNewTask();
  }
}
```

### Agregar una nueva pregunta

```typescript
// e2e/screenplay/questions/MyNewQuestion.ts
import { Question } from './Question';
import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MyNewQuestion implements Question {
  async verify(page: Page): Promise<void> {
    // Verificaciones
  }

  static check(): MyNewQuestion {
    return new MyNewQuestion();
  }
}
```

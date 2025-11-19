# Estructura de Tests E2E - Modelo Screenplay

## Resumen de la Implementación

Se ha implementado un conjunto completo de tests E2E siguiendo el modelo **Screenplay Pattern** con **Playwright** para validar la funcionalidad de búsqueda global y de hashtags en Mastodon.

## Archivos Creados

### Configuración
- `playwright.config.ts` - Configuración principal de Playwright
- `tsconfig.json` - Configuración TypeScript para E2E
- `.gitignore` - Archivos a ignorar en git

### Fixtures y Helpers
- `fixtures/test-data.ts` - Datos de prueba reutilizables
- `fixtures/auth.ts` - Helpers de autenticación (requiere implementación según tu estrategia)

### Modelo Screenplay

#### Actores (`screenplay/actors/`)
- `Actor.ts` - Clase base para actores
- `User.ts` - Actor que representa un usuario autenticado

#### Interacciones (`screenplay/interactions/`)
- `Click.ts` - Interacción de clic
- `Type.ts` - Interacción de escritura
- `WaitFor.ts` - Esperas explícitas
- `Navigate.ts` - Navegación

#### Page Objects (`screenplay/pages/`)
- `BasePage.ts` - Clase base para Page Objects
- `SearchPage.ts` - Page Object para `/search`
- `HashtagPage.ts` - Page Object para `/tags/:id`

#### Tareas (`screenplay/tasks/`)
- `Task.ts` - Interfaz base para tareas
- `OpenTheSearchPage.ts` - Abrir página de búsqueda
- `SearchForTerm.ts` - Buscar término genérico
- `SearchForHashtag.ts` - Buscar hashtag específico
- `OpenHashtagFromMenu.ts` - Abrir hashtag desde menú contextual
- `NavigateToHashtagPage.ts` - Navegar a página de hashtag
- `FilterByType.ts` - Filtrar resultados por tipo
- `ClearSearch.ts` - Limpiar búsqueda

#### Preguntas/Verificaciones (`screenplay/questions/`)
- `Question.ts` - Interfaz base para preguntas
- `SeeGlobalSearchResults.ts` - Verificar resultados globales
- `SeeHashtagResults.ts` - Verificar resultados de hashtag
- `SeeNoResultsMessage.ts` - Verificar mensaje sin resultados
- `SeeSearchSections.ts` - Verificar secciones de resultados

#### Tests (`screenplay/tests/`)
- `search-global.spec.ts` - Tests de búsqueda global (6 tests)
- `search-hashtags.spec.ts` - Tests de búsqueda de hashtags (4 tests)
- `search-hashtag-menu.spec.ts` - Tests del menú de hashtags (3 tests)

### Documentación
- `README.md` - Documentación completa del proyecto E2E

## Comandos Disponibles

```bash
# Ejecutar todos los tests E2E
yarn test:e2e

# Ejecutar con UI interactiva
yarn test:e2e:ui

# Ejecutar en modo headed (navegador visible)
yarn test:e2e:headed

# Ejecutar en modo debug
yarn test:e2e:debug
```

## Próximos Pasos

1. **Autenticación**: Implementar la lógica de autenticación en `fixtures/auth.ts` según tu estrategia (cookies, tokens, etc.)

2. **Datos de Prueba**: Asegurar que existen datos de prueba en la base de datos:
   - Cuentas de usuario
   - Statuses con hashtags
   - Hashtags existentes

3. **Configuración del Entorno**: Configurar las variables de entorno:
   ```bash
   export E2E_BASE_URL=http://localhost:3000
   export E2E_WEB_SERVER_COMMAND="rails server"
   ```

4. **Ajustar Selectores**: Revisar y ajustar los selectores en los Page Objects según la estructura real de tu UI

5. **Ejecutar Tests**: Ejecutar los tests y ajustar timeouts y selectores según sea necesario

## Notas Importantes

- Los tests están diseñados para ser independientes y no modificar datos de producción
- Los selectores están basados en clases CSS y texto visible - pueden necesitar ajuste
- Los timeouts están configurados de forma conservadora pero pueden necesitar ajuste
- La autenticación debe ser implementada según tu estrategia específica

## Ejemplo de Uso

```typescript
import { User } from './screenplay/actors/User';
import { OpenTheSearchPage } from './screenplay/tasks/OpenTheSearchPage';
import { SearchForTerm } from './screenplay/tasks/SearchForTerm';
import { SeeGlobalSearchResults } from './screenplay/questions/SeeGlobalSearchResults';

test('ejemplo de test', async ({ page }) => {
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
});
```


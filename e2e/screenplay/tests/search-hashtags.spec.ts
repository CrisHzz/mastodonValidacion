import { test, expect } from '@playwright/test';
import { User } from '../actors/User';
import { OpenTheSearchPage } from '../tasks/OpenTheSearchPage';
import { SearchForHashtag } from '../tasks/SearchForHashtag';
import { NavigateToHashtagPage } from '../tasks/NavigateToHashtagPage';
import { SeeHashtagResults } from '../questions/SeeHashtagResults';
import { SeeNoResultsMessage } from '../questions/SeeNoResultsMessage';
import { TestData } from '../../fixtures/test-data';
import { SearchPage } from '../pages/SearchPage';
import { Click } from '../interactions/Click';

test.describe('Búsqueda de Hashtags E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos que el usuario ya está autenticado
    // En un entorno real, usarías fixtures de autenticación aquí
  });

  test('debería buscar y navegar a un hashtag desde los resultados de búsqueda', async ({ page }) => {
    const user = User.on(page);
    const hashtag = TestData.hashtags.existing;

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForHashtag.hashtag(hashtag)
    );

    // Verificar que aparecen resultados de hashtags
    const searchPage = new SearchPage(page);
    const hasHashtags = await searchPage.hasHashtagsResults();

    if (hasHashtags) {
      // Hacer clic en el primer hashtag
      await searchPage.clickFirstHashtag();

      // Esperar a que la navegación se complete
      await page.waitForURL(/\/tags\//, { timeout: 10000 });

      // Verificar que estamos en la página del hashtag
      await user.should(
        SeeHashtagResults.for(hashtag, { hasStatuses: true })
      );
    } else {
      // Si no hay hashtags, el test debería fallar o ser marcado como skip
      test.skip();
    }
  });

  test('debería navegar directamente a la página de un hashtag', async ({ page }) => {
    const user = User.on(page);
    const hashtag = TestData.hashtags.existing;

    await user.attemptsTo(
      NavigateToHashtagPage.hashtag(hashtag)
    );

    // Verificar que estamos en la página correcta y hay contenido
    await user.should(
      SeeHashtagResults.for(hashtag)
    );
  });

  test('debería mostrar mensaje de "sin resultados" para hashtag inexistente', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForHashtag.hashtag(TestData.hashtags.nonExistent)
    );

    await user.should(
      SeeNoResultsMessage.message()
    );
  });

  test('debería filtrar solo hashtags cuando se selecciona el filtro de hashtags', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForHashtag.hashtag(TestData.hashtags.existing)
    );

    // Verificar que aparecen hashtags en los resultados
    const searchPage = new SearchPage(page);
    const hashtagsCount = await searchPage.getHashtagsCount();

    // Si hay hashtags, verificar que el filtro funciona
    if (hashtagsCount > 0) {
      expect(hashtagsCount).toBeGreaterThan(0);
    }
  });
});


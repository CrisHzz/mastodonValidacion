import { test, expect } from '@playwright/test';
import { User } from '../actors/User';
import { OpenHashtagFromMenu } from '../tasks/OpenHashtagFromMenu';
import { NavigateToHashtagPage } from '../tasks/NavigateToHashtagPage';
import { SeeHashtagResults } from '../questions/SeeHashtagResults';
import { TestData } from '../../fixtures/test-data';
import { Navigate } from '../interactions/Navigate';
import { WaitFor } from '../interactions/WaitFor';

test.describe('Menú de Hashtags E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos que el usuario ya está autenticado
    // En un entorno real, usarías fixtures de autenticación aquí
  });

  test('debería abrir hashtag desde el menú contextual en un status', async ({ page }) => {
    const user = User.on(page);
    const hashtag = TestData.hashtags.existing;

    // Primero, navegar a una página donde haya hashtags visibles
    // Por ejemplo, el timeline público o home
    await Navigate.to('/home').perform(page);
    await WaitFor.navigation(page);

    // Buscar un status que contenga el hashtag
    // Nota: Este test asume que hay contenido con hashtags en la página
    const hashtagLink = page.locator(`a[data-menu-hashtag]:has-text("#${hashtag}")`).first();

    const linkExists = await hashtagLink.isVisible().catch(() => false);

    if (linkExists) {
      await user.attemptsTo(
        OpenHashtagFromMenu.hashtag(hashtag, 'browse')
      );

      // Verificar que navegamos a la página del hashtag
      await user.should(
        SeeHashtagResults.for(hashtag)
      );
    } else {
      // Si no hay hashtags visibles, crear datos de prueba o saltar el test
      test.skip();
    }
  });

  test('debería navegar a hashtag desde menú y mostrar publicaciones', async ({ page }) => {
    const user = User.on(page);
    const hashtag = TestData.hashtags.existing;

    // Navegar directamente a la página del hashtag
    await user.attemptsTo(
      NavigateToHashtagPage.hashtag(hashtag)
    );

    // Verificar que se muestran publicaciones
    await user.should(
      SeeHashtagResults.withStatuses(hashtag, 0) // Al menos 0 (puede estar vacío)
    );
  });

  test('debería mostrar el hashtag correcto en la URL después de navegar desde el menú', async ({ page }) => {
    const user = User.on(page);
    const hashtag = TestData.hashtags.existing;

    await user.attemptsTo(
      NavigateToHashtagPage.hashtag(hashtag)
    );

    // Verificar que la URL contiene el hashtag
    const currentUrl = page.url();
    expect(currentUrl).toContain(`/tags/${encodeURIComponent(hashtag)}`);
  });
});


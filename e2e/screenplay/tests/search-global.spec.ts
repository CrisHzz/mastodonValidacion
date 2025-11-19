import { test, expect } from '@playwright/test';
import { User } from '../actors/User';
import { OpenTheSearchPage } from '../tasks/OpenTheSearchPage';
import { SearchForTerm } from '../tasks/SearchForTerm';
import { FilterByType } from '../tasks/FilterByType';
import { SeeGlobalSearchResults } from '../questions/SeeGlobalSearchResults';
import { SeeNoResultsMessage } from '../questions/SeeNoResultsMessage';
import { SeeSearchSections } from '../questions/SeeSearchSections';
import { TestData } from '../../fixtures/test-data';
import { SearchPage } from '../pages/SearchPage';

test.describe('Búsqueda Global E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos que el usuario ya está autenticado
    // En un entorno real, usarías fixtures de autenticación aquí
    // await loginUser(page, TestData.users.authenticated);
  });

  test('debería mostrar resultados cuando se busca un término existente', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForTerm.with(TestData.searchTerms.generic)
    );

    // Verificar que se muestran resultados (al menos una sección)
    await user.should(
      SeeGlobalSearchResults.containing({
        hasAccounts: true,
        hasHashtags: true,
        hasStatuses: true,
      })
    );
  });

  test('debería mostrar mensaje de "sin resultados" cuando se busca un término inexistente', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForTerm.with(TestData.searchTerms.nonExistent)
    );

    await user.should(
      SeeNoResultsMessage.message()
    );
  });

  test('debería filtrar resultados por tipo "Hashtags"', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForTerm.with(TestData.searchTerms.generic),
      FilterByType.type('hashtags')
    );

    // Verificar que solo se muestran hashtags
    await user.should(
      SeeSearchSections.sections(['hashtags']),
      SeeSearchSections.notVisible(['accounts', 'statuses'])
    );
  });

  test('debería filtrar resultados por tipo "Accounts"', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForTerm.with(TestData.searchTerms.generic),
      FilterByType.type('accounts')
    );

    // Verificar que solo se muestran cuentas
    await user.should(
      SeeSearchSections.sections(['accounts']),
      SeeSearchSections.notVisible(['hashtags', 'statuses'])
    );
  });

  test('debería filtrar resultados por tipo "Statuses"', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page(),
      SearchForTerm.with(TestData.searchTerms.generic),
      FilterByType.type('statuses')
    );

    // Verificar que solo se muestran statuses
    await user.should(
      SeeSearchSections.sections(['statuses']),
      SeeSearchSections.notVisible(['accounts', 'hashtags'])
    );
  });

  test('debería mostrar mensaje inicial cuando no hay búsqueda', async ({ page }) => {
    const user = User.on(page);

    await user.attemptsTo(
      OpenTheSearchPage.page()
    );

    // Verificar que se muestra el mensaje de "intenta buscar"
    const searchPage = new SearchPage(page);
    const showsMessage = await searchPage.showsNoSearchYetMessage();
    expect(showsMessage).toBe(true);
  });
});


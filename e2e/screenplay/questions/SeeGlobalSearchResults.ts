import { Page } from '@playwright/test';
import { Question } from './Question';
import { SearchPage } from '../pages/SearchPage';
import { expect } from '@playwright/test';

/**
 * Pregunta: Ver resultados de búsqueda global
 * Verifica que se muestren las secciones de resultados esperadas
 */
export class SeeGlobalSearchResults implements Question {
  constructor(
    private readonly options: {
      hasAccounts?: boolean;
      hasHashtags?: boolean;
      hasStatuses?: boolean;
      minAccounts?: number;
      minHashtags?: number;
      minStatuses?: number;
    } = {}
  ) {}

  async verify(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);

    // Verificar secciones según las opciones
    if (this.options.hasAccounts !== undefined) {
      const hasAccounts = await searchPage.hasAccountsResults();
      expect(hasAccounts).toBe(this.options.hasAccounts);

      if (this.options.hasAccounts && this.options.minAccounts) {
        const count = await searchPage.getAccountsCount();
        expect(count).toBeGreaterThanOrEqual(this.options.minAccounts);
      }
    }

    if (this.options.hasHashtags !== undefined) {
      const hasHashtags = await searchPage.hasHashtagsResults();
      expect(hasHashtags).toBe(this.options.hasHashtags);

      if (this.options.hasHashtags && this.options.minHashtags) {
        const count = await searchPage.getHashtagsCount();
        expect(count).toBeGreaterThanOrEqual(this.options.minHashtags);
      }
    }

    if (this.options.hasStatuses !== undefined) {
      const hasStatuses = await searchPage.hasStatusesResults();
      expect(hasStatuses).toBe(this.options.hasStatuses);

      if (this.options.hasStatuses && this.options.minStatuses) {
        const count = await searchPage.getStatusesCount();
        expect(count).toBeGreaterThanOrEqual(this.options.minStatuses);
      }
    }
  }

  static containing(options: {
    hasAccounts?: boolean;
    hasHashtags?: boolean;
    hasStatuses?: boolean;
    minAccounts?: number;
    minHashtags?: number;
    minStatuses?: number;
  }): SeeGlobalSearchResults {
    return new SeeGlobalSearchResults(options);
  }

  static withAccounts(minCount = 1): SeeGlobalSearchResults {
    return new SeeGlobalSearchResults({ hasAccounts: true, minAccounts: minCount });
  }

  static withHashtags(minCount = 1): SeeGlobalSearchResults {
    return new SeeGlobalSearchResults({ hasHashtags: true, minHashtags: minCount });
  }

  static withStatuses(minCount = 1): SeeGlobalSearchResults {
    return new SeeGlobalSearchResults({ hasStatuses: true, minStatuses: minCount });
  }
}


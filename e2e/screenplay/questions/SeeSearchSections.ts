import { Page } from '@playwright/test';
import { Question } from './Question';
import { SearchPage } from '../pages/SearchPage';
import { expect } from '@playwright/test';

/**
 * Pregunta: Ver secciones de búsqueda
 * Verifica que las secciones específicas estén visibles
 */
export class SeeSearchSections implements Question {
  constructor(
    private readonly sections: ('accounts' | 'hashtags' | 'statuses')[],
    private readonly shouldBeVisible: boolean = true
  ) {}

  async verify(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);

    for (const section of this.sections) {
      let isVisible: boolean;

      switch (section) {
        case 'accounts':
          isVisible = await searchPage.hasAccountsResults();
          break;
        case 'hashtags':
          isVisible = await searchPage.hasHashtagsResults();
          break;
        case 'statuses':
          isVisible = await searchPage.hasStatusesResults();
          break;
      }

      expect(isVisible).toBe(this.shouldBeVisible);
    }
  }

  static sections(sections: ('accounts' | 'hashtags' | 'statuses')[]): SeeSearchSections {
    return new SeeSearchSections(sections);
  }

  static notVisible(sections: ('accounts' | 'hashtags' | 'statuses')[]): SeeSearchSections {
    return new SeeSearchSections(sections, false);
  }
}


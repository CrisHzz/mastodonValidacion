import { Page } from '@playwright/test';
import { Task } from './Task';
import { SearchPage } from '../pages/SearchPage';

/**
 * Tarea: Filtrar resultados de búsqueda por tipo
 */
export class FilterByType implements Task {
  constructor(private readonly type: 'accounts' | 'hashtags' | 'statuses' | 'all') {}

  async perform(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);

    switch (this.type) {
      case 'all':
        await searchPage.clickFilterAll();
        break;
      case 'accounts':
        await searchPage.clickFilterAccounts();
        break;
      case 'hashtags':
        await searchPage.clickFilterHashtags();
        break;
      case 'statuses':
        await searchPage.clickFilterStatuses();
        break;
    }

    // Esperar a que los resultados se actualicen
    await searchPage.waitForSearchResults();
  }

  static type(type: 'accounts' | 'hashtags' | 'statuses' | 'all'): FilterByType {
    return new FilterByType(type);
  }
}


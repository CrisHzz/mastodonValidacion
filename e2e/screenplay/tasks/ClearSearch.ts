import { Page } from '@playwright/test';
import { Task } from './Task';
import { SearchPage } from '../pages/SearchPage';
import { Click } from '../interactions/Click';

/**
 * Tarea: Limpiar la búsqueda
 */
export class ClearSearch implements Task {
  async perform(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);
    // Buscar el botón de limpiar (puede ser un botón X o similar)
    const clearButton = searchPage.locator('button[aria-label*="Clear"], button[title*="Clear"], .search__clear-button');

    if (await clearButton.isVisible().catch(() => false)) {
      await Click.on(clearButton).perform(page);
    } else {
      // Si no hay botón, limpiar el input directamente
      const input = searchPage.getSearchInput();
      await input.clear();
    }
  }

  static search(): ClearSearch {
    return new ClearSearch();
  }
}


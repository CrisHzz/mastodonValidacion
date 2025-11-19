import { Page } from '@playwright/test';
import { Task } from './Task';
import { Navigate } from '../interactions/Navigate';
import { SearchPage } from '../pages/SearchPage';

/**
 * Tarea: Abrir la página de búsqueda
 */
export class OpenTheSearchPage implements Task {
  async perform(page: Page): Promise<void> {
    await Navigate.to('/search').perform(page);
    const searchPage = new SearchPage(page);
    await searchPage.waitForPageLoad();
  }

  static page(): OpenTheSearchPage {
    return new OpenTheSearchPage();
  }
}


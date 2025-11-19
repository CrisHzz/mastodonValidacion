import { Page } from '@playwright/test';
import { Task } from './Task';
import { SearchPage } from '../pages/SearchPage';
import { WaitFor } from '../interactions/WaitFor';

/**
 * Tarea: Buscar un término genérico
 */
export class SearchForTerm implements Task {
  constructor(private readonly term: string) {}

  async perform(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);
    await searchPage.typeSearchTerm(this.term);
    // Esperar a que los resultados aparezcan o el mensaje de "sin resultados"
    await searchPage.waitForSearchResults();
  }

  static with(term: string): SearchForTerm {
    return new SearchForTerm(term);
  }
}


import { Page } from '@playwright/test';
import { Question } from './Question';
import { SearchPage } from '../pages/SearchPage';
import { expect } from '@playwright/test';

/**
 * Pregunta: Ver mensaje de "sin resultados"
 * Verifica que se muestre el mensaje apropiado cuando no hay resultados
 */
export class SeeNoResultsMessage implements Question {
  async verify(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);
    const showsNoResults = await searchPage.showsNoResultsMessage();
    expect(showsNoResults).toBe(true);
  }

  static message(): SeeNoResultsMessage {
    return new SeeNoResultsMessage();
  }
}


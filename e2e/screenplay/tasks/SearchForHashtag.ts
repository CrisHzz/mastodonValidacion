import { Page } from '@playwright/test';
import { Task } from './Task';
import { SearchPage } from '../pages/SearchPage';

/**
 * Tarea: Buscar un hashtag específico
 */
export class SearchForHashtag implements Task {
  constructor(private readonly hashtag: string) {}

  async perform(page: Page): Promise<void> {
    const searchPage = new SearchPage(page);
    // Buscar con el símbolo # o sin él
    const searchTerm = this.hashtag.startsWith('#') ? this.hashtag : `#${this.hashtag}`;
    await searchPage.typeSearchTerm(searchTerm);
    await searchPage.waitForSearchResults();
  }

  static hashtag(hashtag: string): SearchForHashtag {
    return new SearchForHashtag(hashtag);
  }
}


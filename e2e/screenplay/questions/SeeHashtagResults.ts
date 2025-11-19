import { Page } from '@playwright/test';
import { Question } from './Question';
import { HashtagPage } from '../pages/HashtagPage';
import { expect } from '@playwright/test';

/**
 * Pregunta: Ver resultados de hashtag
 * Verifica que se muestren los resultados de un hashtag específico
 */
export class SeeHashtagResults implements Question {
  constructor(
    private readonly hashtag: string,
    private readonly options: {
      hasStatuses?: boolean;
      minStatuses?: number;
    } = {}
  ) {}

  async verify(page: Page): Promise<void> {
    const hashtagPage = new HashtagPage(page);

    // Verificar que la URL contiene el hashtag correcto
    expect(hashtagPage.urlContainsHashtag(this.hashtag)).toBe(true);

    // Verificar que el hashtag es visible en la página
    const isVisible = await hashtagPage.isHashtagVisible(this.hashtag);
    expect(isVisible).toBe(true);

    // Verificar statuses si se especifica
    if (this.options.hasStatuses !== undefined) {
      const hasStatuses = await hashtagPage.hasStatuses();
      expect(hasStatuses).toBe(this.options.hasStatuses);

      if (this.options.hasStatuses && this.options.minStatuses) {
        const count = await hashtagPage.getStatusesCount();
        expect(count).toBeGreaterThanOrEqual(this.options.minStatuses);
      }
    }
  }

  static for(hashtag: string, options?: { hasStatuses?: boolean; minStatuses?: number }): SeeHashtagResults {
    return new SeeHashtagResults(hashtag, options);
  }

  static withStatuses(hashtag: string, minCount = 1): SeeHashtagResults {
    return new SeeHashtagResults(hashtag, { hasStatuses: true, minStatuses: minCount });
  }
}


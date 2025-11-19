import { Page } from '@playwright/test';

/**
 * Interacción: Navigate
 * Encapsula la navegación a URLs
 */
export class Navigate {
  constructor(
    private readonly url: string,
    private readonly options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }
  ) {}

  async perform(page: Page): Promise<void> {
    await page.goto(this.url, {
      waitUntil: this.options?.waitUntil || 'networkidle',
    });
  }

  static to(
    url: string,
    options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }
  ): Navigate {
    return new Navigate(url, options);
  }
}


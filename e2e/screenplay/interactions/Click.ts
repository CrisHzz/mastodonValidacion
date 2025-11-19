import { Page, Locator } from '@playwright/test';

/**
 * Interacción: Click
 * Encapsula la acción de hacer clic en un elemento
 */
export class Click {
  constructor(
    private readonly target: Locator | string,
    private readonly options?: { timeout?: number }
  ) {}

  async perform(page: Page): Promise<void> {
    const locator = typeof this.target === 'string'
      ? page.locator(this.target)
      : this.target;

    await locator.click(this.options);
  }

  static on(target: Locator | string, options?: { timeout?: number }): Click {
    return new Click(target, options);
  }
}


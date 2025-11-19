import { Page, Locator } from '@playwright/test';

/**
 * Interacción: Type
 * Encapsula la acción de escribir texto en un elemento
 */
export class Type {
  constructor(
    private readonly target: Locator | string,
    private readonly text: string,
    private readonly options?: { delay?: number; clear?: boolean }
  ) {}

  async perform(page: Page): Promise<void> {
    const locator = typeof this.target === 'string'
      ? page.locator(this.target)
      : this.target;

    if (this.options?.clear !== false) {
      await locator.clear();
    }

    await locator.fill(this.text, this.options);
  }

  static into(
    target: Locator | string,
    text: string,
    options?: { delay?: number; clear?: boolean }
  ): Type {
    return new Type(target, text, options);
  }
}


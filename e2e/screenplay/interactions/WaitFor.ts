import { Page, Locator } from '@playwright/test';

/**
 * Interacción: WaitFor
 * Encapsula esperas explícitas
 */
export class WaitFor {
  constructor(
    private readonly target: Locator | string,
    private readonly options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }
  ) {}

  async perform(page: Page): Promise<void> {
    const locator = typeof this.target === 'string'
      ? page.locator(this.target)
      : this.target;

    const state = this.options?.state || 'visible';
    await locator.waitFor({
      state,
      timeout: this.options?.timeout
    });
  }

  static element(
    target: Locator | string,
    options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }
  ): WaitFor {
    return new WaitFor(target, options);
  }

  static url(page: Page, url: string | RegExp, options?: { timeout?: number }): Promise<void> {
    return page.waitForURL(url, options);
  }

  static navigation(page: Page, options?: { timeout?: number }): Promise<void> {
    return page.waitForLoadState('networkidle', options);
  }
}


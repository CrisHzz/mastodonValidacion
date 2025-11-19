import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la página de hashtag (/tags/:id)
 */
export class HashtagPage extends BasePage {
  private readonly hashtagHeader = '.column-header, .hashtag-header';
  private readonly statusesList = '.status, .status__content';
  private readonly hashtagName = '.hashtag__name, [data-hashtag]';
  private readonly emptyMessage = 'text="No posts found"';

  async waitForPageLoad(): Promise<void> {
    // Esperar a que la página cargue - puede ser el header o la lista de statuses
    await Promise.race([
      this.page.waitForSelector(this.hashtagHeader, { timeout: 10000 }),
      this.page.waitForSelector(this.statusesList, { timeout: 10000 }),
      this.page.waitForSelector(this.emptyMessage, { timeout: 10000 }),
    ]);
  }

  /**
   * Obtiene el nombre del hashtag desde la URL
   */
  getHashtagFromUrl(): string {
    const url = this.getCurrentUrl();
    const match = url.match(/\/tags\/([^/?]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  /**
   * Verifica si el hashtag está visible en la página
   */
  async isHashtagVisible(hashtagName: string): Promise<boolean> {
    // Buscar el hashtag en el contenido de la página
    const hashtagText = `#${hashtagName}`;
    const locator = this.page.locator(`text="${hashtagText}"`).first();
    return await locator.isVisible().catch(() => false);
  }

  /**
   * Obtiene el número de statuses visibles
   */
  async getStatusesCount(): Promise<number> {
    return await this.page.locator(this.statusesList).count();
  }

  /**
   * Verifica si hay statuses visibles
   */
  async hasStatuses(): Promise<boolean> {
    const count = await this.getStatusesCount();
    return count > 0;
  }

  /**
   * Verifica si se muestra el mensaje de "sin posts"
   */
  async showsEmptyMessage(): Promise<boolean> {
    return await this.isVisible(this.emptyMessage);
  }

  /**
   * Obtiene el primer status de la lista
   */
  getFirstStatus() {
    return this.page.locator(this.statusesList).first();
  }

  /**
   * Verifica si la URL contiene el hashtag correcto
   */
  urlContainsHashtag(hashtagName: string): boolean {
    const url = this.getCurrentUrl();
    return url.includes(`/tags/${encodeURIComponent(hashtagName)}`);
  }
}


import { Page, Locator } from '@playwright/test';

/**
 * Clase base para Page Objects
 * Proporciona funcionalidad común para todas las páginas
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Espera a que la página esté lista
   */
  abstract waitForPageLoad(): Promise<void>;

  /**
   * Obtiene el título de la página
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Obtiene la URL actual
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Verifica si un elemento es visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      const locator = this.page.locator(selector);
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el texto de un elemento
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Obtiene un locator
   */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }
}


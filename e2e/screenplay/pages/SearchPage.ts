import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object para la página de búsqueda (/search)
 */
export class SearchPage extends BasePage {
  // Selectores principales
  private readonly searchInput = 'input[type="search"], input[placeholder*="Search"], .search__input';
  private readonly searchResultsContainer = '.explore__search-results';
  private readonly accountsSection = '.search-results__section:has-text("Profiles")';
  private readonly hashtagsSection = '.search-results__section:has-text("Hashtags")';
  private readonly statusesSection = '.search-results__section:has-text("Posts")';
  private readonly noResultsMessage = 'text="No results."';
  private readonly noSearchYetMessage = 'text="Try searching for posts, profiles or hashtags."';

  // Filtros de tipo
  private readonly filterAll = 'button:has-text("All")';
  private readonly filterAccounts = 'button:has-text("Profiles")';
  private readonly filterHashtags = 'button:has-text("Hashtags")';
  private readonly filterStatuses = 'button:has-text("Posts")';

  // Botones "See all"
  private readonly seeAllAccounts = '.search-results__section:has-text("Profiles") button:has-text("See all")';
  private readonly seeAllHashtags = '.search-results__section:has-text("Hashtags") button:has-text("See all")';
  private readonly seeAllStatuses = '.search-results__section:has-text("Posts") button:has-text("See all")';

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector(this.searchInput, { timeout: 10000 });
  }

  /**
   * Obtiene el input de búsqueda
   */
  getSearchInput() {
    return this.page.locator(this.searchInput).first();
  }

  /**
   * Escribe un término de búsqueda
   */
  async typeSearchTerm(term: string): Promise<void> {
    const input = this.getSearchInput();
    await input.clear();
    await input.fill(term);
    // Presionar Enter para enviar la búsqueda
    await input.press('Enter');
  }

  /**
   * Espera a que aparezcan los resultados de búsqueda
   */
  async waitForSearchResults(timeout = 10000): Promise<void> {
    await this.page.waitForSelector(
      `${this.searchResultsContainer} .search-results__section, ${this.noResultsMessage}`,
      { timeout }
    );
  }

  /**
   * Verifica si hay resultados de cuentas
   */
  async hasAccountsResults(): Promise<boolean> {
    return await this.isVisible(this.accountsSection);
  }

  /**
   * Verifica si hay resultados de hashtags
   */
  async hasHashtagsResults(): Promise<boolean> {
    return await this.isVisible(this.hashtagsSection);
  }

  /**
   * Verifica si hay resultados de statuses
   */
  async hasStatusesResults(): Promise<boolean> {
    return await this.isVisible(this.statusesSection);
  }

  /**
   * Verifica si se muestra el mensaje de "sin resultados"
   */
  async showsNoResultsMessage(): Promise<boolean> {
    return await this.isVisible(this.noResultsMessage);
  }

  /**
   * Verifica si se muestra el mensaje de "intenta buscar"
   */
  async showsNoSearchYetMessage(): Promise<boolean> {
    return await this.isVisible(this.noSearchYetMessage);
  }

  /**
   * Hace clic en el filtro "All"
   */
  async clickFilterAll(): Promise<void> {
    await this.page.locator(this.filterAll).click();
  }

  /**
   * Hace clic en el filtro "Accounts"
   */
  async clickFilterAccounts(): Promise<void> {
    await this.page.locator(this.filterAccounts).click();
  }

  /**
   * Hace clic en el filtro "Hashtags"
   */
  async clickFilterHashtags(): Promise<void> {
    await this.page.locator(this.filterHashtags).click();
  }

  /**
   * Hace clic en el filtro "Statuses"
   */
  async clickFilterStatuses(): Promise<void> {
    await this.page.locator(this.filterStatuses).click();
  }

  /**
   * Verifica si el filtro "All" está activo
   */
  async isFilterAllActive(): Promise<boolean> {
    const button = this.page.locator(this.filterAll);
    const classes = await button.getAttribute('class');
    return classes?.includes('active') || false;
  }

  /**
   * Obtiene el primer hashtag de los resultados
   */
  getFirstHashtagLink() {
    return this.page.locator(`${this.hashtagsSection} a[href*="/tags/"]`).first();
  }

  /**
   * Hace clic en el primer hashtag de los resultados
   */
  async clickFirstHashtag(): Promise<void> {
    await this.getFirstHashtagLink().click();
  }

  /**
   * Obtiene el número de resultados de hashtags visibles
   */
  async getHashtagsCount(): Promise<number> {
    if (!(await this.hasHashtagsResults())) {
      return 0;
    }
    return await this.page.locator(`${this.hashtagsSection} a[href*="/tags/"]`).count();
  }

  /**
   * Obtiene el número de resultados de cuentas visibles
   */
  async getAccountsCount(): Promise<number> {
    if (!(await this.hasAccountsResults())) {
      return 0;
    }
    return await this.page.locator(`${this.accountsSection} .account`).count();
  }

  /**
   * Obtiene el número de resultados de statuses visibles
   */
  async getStatusesCount(): Promise<number> {
    if (!(await this.hasStatusesResults())) {
      return 0;
    }
    return await this.page.locator(`${this.statusesSection} .status`).count();
  }
}


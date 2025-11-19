import { Page } from '@playwright/test';
import { Task } from './Task';
import { WaitFor } from '../interactions/WaitFor';
import { Click } from '../interactions/Click';

/**
 * Tarea: Abrir un hashtag desde el menú contextual
 *
 * Esta tarea busca un hashtag en la página (por ejemplo, en un status)
 * y hace clic en él para abrir el menú, luego selecciona la opción de navegar
 */
export class OpenHashtagFromMenu implements Task {
  constructor(
    private readonly hashtag: string,
    private readonly option: 'browse' | 'browseFromAccount' = 'browse'
  ) {}

  async perform(page: Page): Promise<void> {
    // Buscar el enlace del hashtag (debe tener el atributo data-menu-hashtag)
    const hashtagLink = page.locator(`a[data-menu-hashtag]:has-text("#${this.hashtag}")`).first();

    // Hacer clic en el hashtag para abrir el menú
    await hashtagLink.click();

    // Esperar a que el menú aparezca
    await WaitFor.element(page.locator('.dropdown-menu')).perform(page);

    // Seleccionar la opción según el tipo
    if (this.option === 'browse') {
      // "Browse posts in #{hashtag}"
      await Click.on('button:has-text("Browse posts")').perform(page);
    } else {
      // "Browse posts from @{name} in #{hashtag}"
      await Click.on('button:has-text("Browse posts from")').perform(page);
    }

    // Esperar a que la navegación se complete
    await WaitFor.navigation(page);
  }

  static hashtag(hashtag: string, option: 'browse' | 'browseFromAccount' = 'browse'): OpenHashtagFromMenu {
    return new OpenHashtagFromMenu(hashtag, option);
  }
}


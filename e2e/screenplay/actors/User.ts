import { Page } from '@playwright/test';
import { Actor } from './Actor';

/**
 * Actor User - representa un usuario autenticado
 */
export class User extends Actor {
  constructor(page: Page, name = 'User') {
    super(page, name);
  }

  /**
   * Crea una instancia de User
   */
  static named(name: string, page: Page): User {
    return new User(page, name);
  }

  /**
   * Crea una instancia de User con nombre por defecto
   */
  static on(page: Page): User {
    return new User(page);
  }
}


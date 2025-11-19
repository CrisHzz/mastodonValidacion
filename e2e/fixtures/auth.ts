import { Page, BrowserContext } from '@playwright/test';

/**
 * Helpers para autenticación en tests E2E
 *
 * NOTA: Estos helpers asumen que existe un endpoint de autenticación.
 * En un entorno real, podrías necesitar:
 * - Usar cookies de sesión directamente
 * - Hacer login programático vía API
 * - Usar fixtures de Playwright para reutilizar sesiones
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Autentica un usuario en la aplicación
 * @param page - Página de Playwright
 * @param credentials - Credenciales del usuario
 */
export async function loginUser(
  page: Page,
  credentials: AuthCredentials
): Promise<void> {
  // Navegar a la página de login
  await page.goto('/auth/sign_in');

  // Esperar a que el formulario esté disponible
  await page.waitForSelector('input[name="user[email]"]', { timeout: 10000 });

  // Llenar el formulario
  await page.fill('input[name="user[email]"]', credentials.email);
  await page.fill('input[name="user[password]"]', credentials.password);

  // Enviar el formulario
  await page.click('button[type="submit"]');

  // Esperar a que la navegación se complete (asumiendo redirección a home)
  await page.waitForURL(/^\/(home|deck|about)/, { timeout: 15000 });
}

/**
 * Crea un contexto de navegador con autenticación
 * Útil para reutilizar sesiones entre tests
 */
export async function createAuthenticatedContext(
  baseURL: string,
  credentials: AuthCredentials
): Promise<BrowserContext> {
  // Esta función debería ser implementada según tu estrategia de autenticación
  // Por ejemplo, usando cookies o tokens
  throw new Error('createAuthenticatedContext not implemented. Implement according to your auth strategy.');
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Verificar si hay elementos que solo aparecen cuando el usuario está autenticado
  // Por ejemplo, el botón de perfil o el menú de usuario
  const authenticatedIndicator = await page.locator('[data-testid="user-menu"], .navigation-bar__profile').first();
  return await authenticatedIndicator.isVisible().catch(() => false);
}


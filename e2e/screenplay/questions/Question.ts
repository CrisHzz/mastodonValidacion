import { Page } from '@playwright/test';

/**
 * Interfaz base para preguntas/verificaciones en el modelo Screenplay
 * Las preguntas representan expectativas que se pueden verificar
 */
export interface Question {
  verify(page: Page): Promise<void>;
}


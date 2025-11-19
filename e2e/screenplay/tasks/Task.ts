import { Page } from '@playwright/test';

/**
 * Interfaz base para tareas en el modelo Screenplay
 * Las tareas representan acciones que un actor puede realizar
 */
export interface Task {
  perform(page: Page): Promise<void>;
}


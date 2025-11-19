import { Page } from '@playwright/test';
import { Task } from '../tasks/Task';
import { Question } from '../questions/Question';

/**
 * Clase base Actor del modelo Screenplay
 * Los actores pueden realizar tareas (attemptsTo) y verificar resultados (should)
 */
export class Actor {
  constructor(
    protected readonly page: Page,
    protected readonly name: string
  ) {}

  /**
   * El actor intenta realizar una o más tareas
   */
  async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await task.perform(this.page);
    }
  }

  /**
   * El actor verifica que se cumplan una o más preguntas/expectativas
   */
  async should(...questions: Question[]): Promise<void> {
    for (const question of questions) {
      await question.verify(this.page);
    }
  }

  /**
   * Obtiene el nombre del actor
   */
  getName(): string {
    return this.name;
  }

  /**
   * Obtiene la página asociada al actor
   */
  getPage(): Page {
    return this.page;
  }
}


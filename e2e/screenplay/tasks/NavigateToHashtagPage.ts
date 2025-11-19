import { Page } from '@playwright/test';
import { Task } from './Task';
import { Navigate } from '../interactions/Navigate';
import { HashtagPage } from '../pages/HashtagPage';

/**
 * Tarea: Navegar directamente a la página de un hashtag
 */
export class NavigateToHashtagPage implements Task {
  constructor(private readonly hashtag: string) {}

  async perform(page: Page): Promise<void> {
    const encodedHashtag = encodeURIComponent(this.hashtag);
    await Navigate.to(`/tags/${encodedHashtag}`).perform(page);
    const hashtagPage = new HashtagPage(page);
    await hashtagPage.waitForPageLoad();
  }

  static hashtag(hashtag: string): NavigateToHashtagPage {
    return new NavigateToHashtagPage(hashtag);
  }
}


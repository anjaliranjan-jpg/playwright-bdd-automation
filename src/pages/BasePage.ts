import { Page, expect } from '@playwright/test';
import { config } from '../../config/env';
import { Logger } from '../utils/logger';

export class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = config.baseUrl;
  }

  async navigate(path: string = ''): Promise<void> {
    const url = `${this.baseUrl}${path}`;
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await expect(this.page).toHaveURL(new RegExp(path || '/'));
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async dismissAds(): Promise<void> {
    try {
      const adFrame = this.page.frameLocator('iframe[id*="google"]').first();
      const closeBtn = adFrame.getByRole('button', { name: /close/i });
      if (await closeBtn.isVisible({ timeout: 2000 })) {
        await closeBtn.click();
      }
    } catch {
      // No ad to dismiss
    }
  }
}

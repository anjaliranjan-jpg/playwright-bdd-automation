import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, APIRequestContext, request } from 'playwright';
import { config } from '../../config/env';
import type { ScenarioContext } from '../utils/types';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  apiContext!: APIRequestContext;
  scenarioContext: ScenarioContext = {};

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: config.headless,
      slowMo: config.slowMo,
    });
    this.context = await this.browser.newContext({
      viewport: config.viewport,
      ignoreHTTPSErrors: true,
    });
    this.context.setDefaultTimeout(config.defaultTimeout);
    this.context.setDefaultNavigationTimeout(config.navigationTimeout);
    this.page = await this.context.newPage();
  }

  async initApiContext(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: config.apiBaseUrl,
      ignoreHTTPSErrors: true,
    });
  }

  async closeBrowser(): Promise<void> {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  async closeApiContext(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }
}

setWorldConstructor(CustomWorld);

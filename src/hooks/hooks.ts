import { Before, After, BeforeAll, AfterAll, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

BeforeAll(async function () {
  Logger.info('=== Test Suite Starting ===');
  const resultsDir = path.join(process.cwd(), 'allure-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
});

AfterAll(async function () {
  Logger.info('=== Test Suite Completed ===');
});

Before({ tags: '@ui or @smoke or @regression' }, async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  Logger.info(`Starting UI scenario: ${scenario.pickle.name}`);
  await this.initBrowser();
});

Before({ tags: '@api' }, async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  Logger.info(`Starting API scenario: ${scenario.pickle.name}`);
  await this.initApiContext();
});

After({ tags: '@ui or @smoke or @regression' }, async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  try {
    if (scenario.result?.status === Status.FAILED) {
      Logger.warn(`Scenario FAILED: ${scenario.pickle.name} - capturing artifacts`);

      if (this.page && !this.page.isClosed()) {
        const screenshot = await this.page.screenshot({
          fullPage: true,
          type: 'png',
        });
        this.attach(screenshot, 'image/png');
        Logger.info('Screenshot captured and attached to report');
      }
    }
  } catch (err) {
    Logger.error('Failed to capture screenshot', err);
  } finally {
    await this.closeBrowser();
    Logger.info(`Finished UI scenario: ${scenario.pickle.name}`);
  }
});

After({ tags: '@api' }, async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  await this.closeApiContext();
  Logger.info(`Finished API scenario: ${scenario.pickle.name}`);
});

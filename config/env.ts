export const config = {
  baseUrl: 'https://www.automationexercise.com',
  apiBaseUrl: 'https://www.automationexercise.com/api',
  defaultTimeout: 30000,
  navigationTimeout: 60000,
  headless: process.env.HEADLESS !== 'false',
  slowMo: 0,
  viewport: { width: 1280, height: 720 },
  screenshotOnFailure: true,
  traceOnFailure: true,
};

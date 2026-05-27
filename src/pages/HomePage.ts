import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly navBar: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly contactUsLink: Locator;
  readonly headerSlider: Locator;
  readonly featuredItemsSection: Locator;
  readonly subscriptionSection: Locator;
  readonly footerSection: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.getByRole('img', { name: 'Website for automation practice' });
    this.navBar = page.locator('#header .navbar-nav');
    this.homeLink = page.getByRole('link', { name: 'Home' }).first();
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.loginLink = page.getByRole('link', { name: ' Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: ' Logout' });
    this.contactUsLink = page.getByRole('link', { name: ' Contact us' });
    this.headerSlider = page.locator('#slider');
    this.featuredItemsSection = page.locator('.features_items');
    this.subscriptionSection = page.locator('#footer');
    this.footerSection = page.locator('#footer');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl);
    await this.waitForPageLoad();
  }

  async verifyHomePageLoaded(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.navBar).toBeVisible();
    await expect(this.featuredItemsSection).toBeVisible();
  }

  async verifyNavbarLinks(): Promise<void> {
    await expect(this.homeLink).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.contactUsLink).toBeVisible();
  }

  async isUserLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }

  async clickLogin(): Promise<void> {
    await this.loginLink.click();
  }

  async clickProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }

  async clickContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  async getLoggedInUserName(): Promise<string> {
    const userEl = this.page.getByText(/Logged in as/);
    await expect(userEl).toBeVisible();
    const text = await userEl.textContent(); return text ?? '';
  }
}

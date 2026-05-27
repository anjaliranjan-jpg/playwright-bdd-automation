import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly productsList: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly brandsList: Locator;
  readonly leftSidebar: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'All Products' });
    this.productsList = page.locator('.features_items');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.brandsList = page.locator('.brands-name');
    this.leftSidebar = page.locator('.left-sidebar');
  }

  async goto(): Promise<void> {
    await this.navigate('/products');
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyProductsVisible(): Promise<void> {
    await expect(this.productsList).toBeVisible();
    const products = this.page.locator('.productinfo');
    await expect(products.first()).toBeVisible();
  }

  async searchForProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  async verifySearchResultsVisible(): Promise<void> {
    const products = this.page.locator('.productinfo');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyNoSearchResults(): Promise<void> {
    const products = this.page.locator('.productinfo');
    const count = await products.count();
    expect(count).toBe(0);
  }

  async clickViewProductByIndex(index: number): Promise<void> {
    const viewLinks = this.page.getByRole('link', { name: 'View Product' });
    await viewLinks.nth(index).click();
  }

  async clickBrandFilter(brandName: string): Promise<void> {
    await this.brandsList.getByRole('link', { name: brandName }).click();
  }

  async verifyBrandProductsVisible(brandName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: new RegExp(brandName, 'i') })).toBeVisible();
    const products = this.page.locator('.productinfo');
    await expect(products.first()).toBeVisible();
  }

  async addFirstProductToCart(): Promise<void> {
    const addToCartBtn = this.page.locator('.productinfo').first().getByRole('link', { name: 'Add to cart' });
    await addToCartBtn.click();
  }

  async dismissAddedToCartModal(): Promise<void> {
    const continueBtn = this.page.getByRole('button', { name: 'Continue Shopping' });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
  }

  async viewCartFromModal(): Promise<void> {
    const viewCartBtn = this.page.getByRole('link', { name: 'View Cart' });
    await expect(viewCartBtn).toBeVisible();
    await viewCartBtn.click();
  }
}

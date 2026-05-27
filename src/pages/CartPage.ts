import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('#cart_info_table');
    this.emptyCartMessage = page.getByText('Cart is empty!');
    this.cartItems = page.locator('#cart_info_table tbody tr');
  }

  async goto(): Promise<void> {
    await this.navigate('/view_cart');
    await this.waitForPageLoad();
  }

  async verifyCartHasItems(): Promise<void> {
    await expect(this.cartTable).toBeVisible();
    const count = await this.cartItems.count();
    expect(count).toBeGreaterThan(0);
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async updateItemQuantity(itemIndex: number, quantity: string): Promise<void> {
    // Navigate to product page to update quantity
    const productLink = this.cartItems.nth(itemIndex).getByRole('link');
    await productLink.click();
    const qtyInput = this.page.locator('#quantity');
    await qtyInput.clear();
    await qtyInput.fill(quantity);
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getItemQuantity(itemIndex: number): Promise<string> {
    const qtyCell = this.cartItems.nth(itemIndex).locator('.cart_quantity button');
    return (await qtyCell.textContent()) ?? '0';
  }

  async getTotalPrice(itemIndex: number): Promise<string> {
    const totalCell = this.cartItems.nth(itemIndex).locator('.cart_total p');
    return (await totalCell.textContent()) ?? '0';
  }
}

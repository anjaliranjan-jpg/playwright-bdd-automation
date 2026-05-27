import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { UserRegistrationData, LoginCredentials } from '../utils/types';

export class LoginPage extends BasePage {
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginFormHeading: Locator;
  readonly signupFormHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmailInput = page.getByPlaceholder('Email Address').nth(0);
    this.loginPasswordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
    this.signupNameInput = page.getByPlaceholder('Name');
    this.signupEmailInput = page.getByPlaceholder('Email Address').nth(1);
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.loginFormHeading = page.getByText('Login to your account');
    this.signupFormHeading = page.getByText('New User Signup!');
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
    await expect(this.loginFormHeading).toBeVisible();
  }

  async verifyLoginPageLayout(): Promise<void> {
    await expect(this.loginFormHeading).toBeVisible();
    await expect(this.signupFormHeading).toBeVisible();
    await expect(this.loginEmailInput).toBeVisible();
    await expect(this.loginPasswordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.loginEmailInput.fill(credentials.email);
    await this.loginPasswordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async verifyLoginError(): Promise<void> {
    await expect(this.loginErrorMessage).toBeVisible();
  }

  async fillSignupForm(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}

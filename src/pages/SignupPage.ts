import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { UserRegistrationData } from '../utils/types';

export class SignupPage extends BasePage {
  readonly pageHeading: Locator;
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly nameInput: Locator;
  readonly passwordInput: Locator;
  readonly birthDaySelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthYearSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByText('Enter Account Information');
    this.titleMr = page.getByRole('radio', { name: 'Mr.' });
    this.titleMrs = page.getByRole('radio', { name: 'Mrs.' });
    this.nameInput = page.locator('#name');
    this.passwordInput = page.locator('#password');
    this.birthDaySelect = page.locator('#days');
    this.birthMonthSelect = page.locator('#months');
    this.birthYearSelect = page.locator('#years');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedHeading = page.getByText('Account Created!');
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  async fillRegistrationForm(user: UserRegistrationData): Promise<void> {
    await expect(this.pageHeading).toBeVisible();

    if (user.title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }

    await this.passwordInput.fill(user.password);
    await this.birthDaySelect.selectOption(user.birthDay);
    await this.birthMonthSelect.selectOption(user.birthMonth);
    await this.birthYearSelect.selectOption(user.birthYear);

    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  async submitRegistration(): Promise<void> {
    await this.createAccountButton.click();
  }

  async verifyAccountCreated(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}

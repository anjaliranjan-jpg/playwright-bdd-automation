import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ContactFormData } from '../utils/types';
import * as path from 'path';
import * as fs from 'fs';

export class ContactUsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByPlaceholder('Your Name');
    this.emailInput = page.getByPlaceholder('Your Email');
    this.subjectInput = page.getByPlaceholder('Subject');
    this.messageTextarea = page.getByPlaceholder('Your Message Here');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.getByText('Success! Your details have been submitted successfully.');
  }

  async goto(): Promise<void> {
    await this.navigate('/contact_us');
    await expect(this.pageHeading).toBeVisible();
  }

  async fillContactForm(data: ContactFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageTextarea.fill(data.message);
  }

  async uploadFile(): Promise<void> {
    // Create a temp file to upload
    const tmpPath = path.join(process.cwd(), 'src', 'utils', 'test-upload.txt');
    if (!fs.existsSync(tmpPath)) {
      fs.writeFileSync(tmpPath, 'Test file for automation upload');
    }
    await this.fileUploadInput.setInputFiles(tmpPath);
  }

  async submitForm(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async verifySubmissionSuccess(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }
}

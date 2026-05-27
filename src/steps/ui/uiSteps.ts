import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Browser, BrowserContext, chromium } from '@playwright/test';
import { CustomWorld } from '../../hooks/world';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { ContactUsPage } from '../../pages/ContactUsPage';
import { DataGenerator } from '../../utils/dataGenerator';
import { Logger } from '../../utils/logger';
import type { UserRegistrationData, LoginCredentials } from '../../utils/types';
import { config } from '../../../config/env';

// ─── Page Object Helpers ───────────────────────────────────────────────────────

function getHomePage(world: CustomWorld): HomePage {
  return new HomePage(world.page);
}
function getLoginPage(world: CustomWorld): LoginPage {
  return new LoginPage(world.page);
}
function getSignupPage(world: CustomWorld): SignupPage {
  return new SignupPage(world.page);
}
function getProductsPage(world: CustomWorld): ProductsPage {
  return new ProductsPage(world.page);
}
function getProductDetailPage(world: CustomWorld): ProductDetailPage {
  return new ProductDetailPage(world.page);
}
function getCartPage(world: CustomWorld): CartPage {
  return new CartPage(world.page);
}
function getContactUsPage(world: CustomWorld): ContactUsPage {
  return new ContactUsPage(world.page);
}

// ─── GIVEN Steps ──────────────────────────────────────────────────────────────

Given('I navigate to the home page', async function (this: CustomWorld) {
  Logger.step('Navigate to home page');
  const homePage = getHomePage(this);
  await homePage.goto();
  await homePage.verifyHomePageLoaded();
});

Given('a registered user exists in the system', async function (this: CustomWorld) {
  Logger.step('Creating a registered user via UI');
  const userData = DataGenerator.generateUser();
  this.scenarioContext.userData = userData;
  this.scenarioContext.loginCredentials = {
    email: userData.email,
    password: userData.password,
  };

  // Register user via UI
  const homePage = getHomePage(this);
  await homePage.goto();
  await homePage.clickLogin();

  const loginPage = getLoginPage(this);
  await loginPage.fillSignupForm(userData.name, userData.email);

  const signupPage = getSignupPage(this);
  await signupPage.fillRegistrationForm(userData);
  await signupPage.submitRegistration();
  await signupPage.verifyAccountCreated();
  await signupPage.clickContinue();

  // Logout so test can login fresh
  await homePage.clickLogout();
  Logger.info(`Registered user: ${userData.email}`);
});

Given('I navigate to the home page with image requests intercepted', async function (this: CustomWorld) {
  Logger.step('Setting up network interception for image requests');
  await this.page.route('**/*.{png,jpg,jpeg,gif,webp,svg}', (route) => {
    route.abort();
  });
  const homePage = getHomePage(this);
  await this.page.goto(config.baseUrl);
  await this.page.waitForLoadState('domcontentloaded');
});

Given('the API client is initialized', async function (this: CustomWorld) {
  Logger.step('API client already initialized via Before hook');
  // apiContext is initialized in Before hook for @api tagged scenarios
});

Given('I have dynamically generated user data for the lifecycle test', async function (this: CustomWorld) {
  this.scenarioContext.userData = DataGenerator.generateUser();
  Logger.info(`Generated lifecycle user: ${this.scenarioContext.userData.email}`);
});

// ─── WHEN Steps ───────────────────────────────────────────────────────────────

When('I click on the Signup Login link', async function (this: CustomWorld) {
  Logger.step('Clicking Signup/Login link');
  const homePage = getHomePage(this);
  await homePage.clickLogin();
});

When('I fill the signup form with dynamically generated user data', async function (this: CustomWorld) {
  Logger.step('Filling signup form with dynamic data');
  const userData = DataGenerator.generateUser();
  this.scenarioContext.userData = userData;
  this.scenarioContext.loginCredentials = { email: userData.email, password: userData.password };

  const loginPage = getLoginPage(this);
  await loginPage.fillSignupForm(userData.name, userData.email);
});

When('I complete the registration form', async function (this: CustomWorld) {
  Logger.step('Completing registration form');
  const userData = this.scenarioContext.userData as UserRegistrationData;
  const signupPage = getSignupPage(this);
  await signupPage.fillRegistrationForm(userData);
  await signupPage.submitRegistration();
});

When('I log in with valid credentials', async function (this: CustomWorld) {
  Logger.step('Logging in with valid credentials');
  const credentials = this.scenarioContext.loginCredentials as LoginCredentials;
  const loginPage = getLoginPage(this);
  await loginPage.login(credentials);
});

When('I log in with invalid credentials', async function (this: CustomWorld) {
  Logger.step('Attempting login with invalid credentials');
  const invalidCreds = DataGenerator.generateInvalidCredentials();
  const loginPage = getLoginPage(this);
  await loginPage.login(invalidCreds);
});

When('I click the logout button', async function (this: CustomWorld) {
  Logger.step('Clicking logout');
  const homePage = getHomePage(this);
  await homePage.clickLogout();
});

When('I navigate to the products page', async function (this: CustomWorld) {
  Logger.step('Navigating to products page');
  const productsPage = getProductsPage(this);
  await productsPage.goto();
});

When('I click on the first product to view details', async function (this: CustomWorld) {
  Logger.step('Clicking on first product to view details');
  const productsPage = getProductsPage(this);
  await productsPage.clickViewProductByIndex(0);
});

When('I search for a product with keyword {string}', async function (this: CustomWorld, keyword: string) {
  Logger.step(`Searching for product: ${keyword}`);
  const productsPage = getProductsPage(this);
  await productsPage.searchForProduct(keyword);
});

When('I click on the brand filter {string}', async function (this: CustomWorld, brandName: string) {
  Logger.step(`Clicking brand filter: ${brandName}`);
  const productsPage = getProductsPage(this);
  await productsPage.clickBrandFilter(brandName);
});

When('I add the first product to the cart', async function (this: CustomWorld) {
  Logger.step('Adding first product to cart');
  const productsPage = getProductsPage(this);
  await productsPage.addFirstProductToCart();
});

When('I dismiss the cart modal', async function (this: CustomWorld) {
  Logger.step('Dismissing cart modal');
  const productsPage = getProductsPage(this);
  await productsPage.dismissAddedToCartModal();
});

When('I view cart from the modal', async function (this: CustomWorld) {
  Logger.step('Viewing cart from modal');
  const productsPage = getProductsPage(this);
  await productsPage.viewCartFromModal();
});

When('I navigate to the cart page', async function (this: CustomWorld) {
  Logger.step('Navigating to cart page');
  const cartPage = getCartPage(this);
  await cartPage.goto();
});

When('I click on the Contact Us link', async function (this: CustomWorld) {
  Logger.step('Clicking Contact Us');
  const homePage = getHomePage(this);
  await homePage.clickContactUs();
});

When('I fill the contact form with generated data', async function (this: CustomWorld) {
  Logger.step('Filling contact form');
  const contactPage = getContactUsPage(this);
  const formData = DataGenerator.generateContactForm();
  await contactPage.fillContactForm(formData);
});

When('I upload a file to the contact form', async function (this: CustomWorld) {
  Logger.step('Uploading file to contact form');
  const contactPage = getContactUsPage(this);
  await contactPage.uploadFile();
});

When('I submit the contact form', async function (this: CustomWorld) {
  Logger.step('Submitting contact form');
  const contactPage = getContactUsPage(this);
  await contactPage.submitForm();
});

// ─── UI-017: Multi-Context Steps ──────────────────────────────────────────────

let contextACookies: Array<{ name: string; value: string; domain: string; path: string }> = [];
let secondBrowser: Browser | null = null;
let contextB: BrowserContext | null = null;

When('I log in via browser context A', async function (this: CustomWorld) {
  Logger.step('Logging in via Context A');
  const credentials = this.scenarioContext.loginCredentials as LoginCredentials;
  const homePage = getHomePage(this);
  await homePage.goto();
  await homePage.clickLogin();
  const loginPage = getLoginPage(this);
  await loginPage.login(credentials);
  await expect(this.page.getByText(/Logged in as/)).toBeVisible();
});

When('I extract the authenticated cookies from context A', async function (this: CustomWorld) {
  Logger.step('Extracting cookies from Context A');
  contextACookies = await this.context.cookies();
  Logger.info(`Extracted ${contextACookies.length} cookies from Context A`);
  expect(contextACookies.length).toBeGreaterThan(0);
});

When('I create an isolated browser context B with injected cookies', async function (this: CustomWorld) {
  Logger.step('Creating isolated Context B with injected cookies');
  secondBrowser = await chromium.launch({ headless: config.headless });
  contextB = await secondBrowser.newContext({ viewport: config.viewport });
  await contextB.addCookies(contextACookies);
  Logger.info('Cookies injected into Context B');
});

Then('context B should access the authenticated page without logging in', async function (this: CustomWorld) {
  Logger.step('Verifying Context B session bypasses login');
  if (!contextB) throw new Error('Context B was not initialized');

  const pageB = await contextB.newPage();
  await pageB.goto(`${config.baseUrl}`);
  await pageB.waitForLoadState('domcontentloaded');

  const loggedInText = pageB.getByText(/Logged in as/);
  await expect(loggedInText).toBeVisible();
  Logger.info('Context B successfully authenticated via cookie injection');

  await pageB.close();
  await contextB.close();
  if (secondBrowser) await secondBrowser.close();
  contextB = null;
  secondBrowser = null;
});

// ─── THEN Steps ───────────────────────────────────────────────────────────────

Then('the home page logo is visible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.logo).toBeVisible();
});

Then('the navigation bar is visible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.navBar).toBeVisible();
});

Then('the featured items section is visible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.featuredItemsSection).toBeVisible();
});

Then('the footer section is visible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.footerSection).toBeVisible();
});

Then('all main navigation links are visible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await homePage.verifyNavbarLinks();
});

Then('the navigation links are accessible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.productsLink).toBeEnabled();
  await expect(homePage.cartLink).toBeEnabled();
  await expect(homePage.loginLink).toBeEnabled();
});

Then('the login form is visible', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await expect(loginPage.loginFormHeading).toBeVisible();
  await expect(loginPage.loginEmailInput).toBeVisible();
});

Then('the signup form is visible', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await expect(loginPage.signupFormHeading).toBeVisible();
  await expect(loginPage.signupNameInput).toBeVisible();
});

Then('the account is created successfully', async function (this: CustomWorld) {
  const signupPage = getSignupPage(this);
  await signupPage.verifyAccountCreated();
});

Then('I continue to the home page as a logged in user', async function (this: CustomWorld) {
  const signupPage = getSignupPage(this);
  await signupPage.clickContinue();
  const homePage = getHomePage(this);
  const isLoggedIn = await homePage.isUserLoggedIn();
  expect(isLoggedIn).toBeTruthy();
});

Then('I am logged in and the user profile banner is displayed', async function (this: CustomWorld) {
  const loggedInBanner = this.page.getByText(/Logged in as/);
  await expect(loggedInBanner).toBeVisible();
});

Then('a login error message is displayed', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.verifyLoginError();
});

Then('I am redirected to the login page', async function (this: CustomWorld) {
  const loginPage = getLoginPage(this);
  await expect(loginPage.loginFormHeading).toBeVisible();
});

Then('the products grid is visible with items', async function (this: CustomWorld) {
  const productsPage = getProductsPage(this);
  await productsPage.verifyProductsVisible();
});

Then('the product name is visible', async function (this: CustomWorld) {
  const detailPage = getProductDetailPage(this);
  await expect(detailPage.productName).toBeVisible();
});

Then('the product price is visible', async function (this: CustomWorld) {
  const detailPage = getProductDetailPage(this);
  await expect(detailPage.productPrice).toBeVisible();
});

Then('the product availability is displayed', async function (this: CustomWorld) {
  const detailPage = getProductDetailPage(this);
  await expect(detailPage.productAvailability).toBeVisible();
});

Then('the product brand is displayed', async function (this: CustomWorld) {
  const detailPage = getProductDetailPage(this);
  await expect(detailPage.productBrand).toBeVisible();
});

Then('search results are displayed with matching products', async function (this: CustomWorld) {
  const productsPage = getProductsPage(this);
  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await productsPage.verifySearchResultsVisible();
});

Then('the searched products section is visible', async function (this: CustomWorld) {
  const productsPage = getProductsPage(this);
  await expect(productsPage.searchedProductsHeading).toBeVisible();
});

Then('no product results are shown', async function (this: CustomWorld) {
  const productsPage = getProductsPage(this);
  await productsPage.verifyNoSearchResults();
});

Then('products filtered by brand {string} are displayed', async function (this: CustomWorld, brandName: string) {
  const productsPage = getProductsPage(this);
  await productsPage.verifyBrandProductsVisible(brandName);
});

Then('the cart contains at least one item', async function (this: CustomWorld) {
  const cartPage = getCartPage(this);
  await cartPage.verifyCartHasItems();
});

Then('the cart item quantity is shown correctly', async function (this: CustomWorld) {
  const cartPage = getCartPage(this);
  await expect(cartPage.cartTable).toBeVisible();
  const count = await cartPage.getCartItemCount();
  expect(count).toBeGreaterThan(0);
});

Then('the contact form submission is successful', async function (this: CustomWorld) {
  const contactPage = getContactUsPage(this);
  await contactPage.verifySubmissionSuccess();
});

Then('the page layout is stable without blocked image assets', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.navBar).toBeVisible();
  await expect(homePage.featuredItemsSection).toBeVisible();
});

Then('key navigation elements remain visible', async function (this: CustomWorld) {
  const homePage = getHomePage(this);
  await expect(homePage.productsLink).toBeVisible();
  await expect(homePage.loginLink).toBeVisible();
  await expect(homePage.cartLink).toBeVisible();
  Logger.info('All key navigation elements confirmed visible after image blocking');
});

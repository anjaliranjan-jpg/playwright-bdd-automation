import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../hooks/world';
import { ApiClient } from '../../api/apiClient';
import { DataGenerator } from '../../utils/dataGenerator';
import { Logger } from '../../utils/logger';
import type {
  ProductsListResponse,
  BrandsListResponse,
  SearchProductResponse,
  MessageResponse,
  UserRegistrationData,
} from '../../utils/types';
import { config } from '../../../config/env';

// ─── Shared State ─────────────────────────────────────────────────────────────

interface ApiTestState {
  productsResponse?: ProductsListResponse;
  brandsResponse?: BrandsListResponse;
  searchResponse?: SearchProductResponse;
  messageResponse?: MessageResponse;
  lastResponseCode?: number;
  lastMessage?: string;
}

function getApiClient(world: CustomWorld): ApiClient {
  return new ApiClient(world.apiContext, config.apiBaseUrl);
}

// ─── GIVEN Steps ──────────────────────────────────────────────────────────────

Given('I have dynamically generated user data for the lifecycle test', async function (this: CustomWorld) {
  this.scenarioContext.userData = DataGenerator.generateUser();
  Logger.info(`Lifecycle test user: ${this.scenarioContext.userData.email}`);
});

// ─── WHEN Steps ───────────────────────────────────────────────────────────────

When('I send a GET request to the products list endpoint', async function (this: CustomWorld) {
  Logger.step('GET /productsList');
  const client = getApiClient(this);
  const response = await client.getProductsList();
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { productsResponse: response, lastResponseCode: response.responseCode };
});

When('I send an invalid POST request to the products list endpoint', async function (this: CustomWorld) {
  Logger.step('POST /productsList (invalid)');
  const client = getApiClient(this);
  const response = await client.postProductsListInvalid();
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode, lastMessage: response.message };
});

When('I send a GET request to the brands list endpoint', async function (this: CustomWorld) {
  Logger.step('GET /brandsList');
  const client = getApiClient(this);
  const response = await client.getBrandsList();
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { brandsResponse: response, lastResponseCode: response.responseCode };
});

When('I send an invalid PUT request to the brands list endpoint', async function (this: CustomWorld) {
  Logger.step('PUT /brandsList (invalid)');
  const client = getApiClient(this);
  const response = await client.putBrandsListInvalid();
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode, lastMessage: response.message };
});

When('I search for a product with keyword {string}', async function (this: CustomWorld, keyword: string) {
  Logger.step(`POST /searchProduct keyword: ${keyword}`);
  const client = getApiClient(this);
  const response = await client.searchProduct(keyword);
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { searchResponse: response, lastResponseCode: response.responseCode };
});

When('I send a POST searchProduct request without the search parameter', async function (this: CustomWorld) {
  Logger.step('POST /searchProduct (missing param)');
  const client = getApiClient(this);
  const response = await client.searchProductWithoutParam();
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode, lastMessage: response.message };
});

When('I create a new account via POST createAccount', async function (this: CustomWorld) {
  Logger.step('POST /createAccount');
  const client = getApiClient(this);
  const userData = this.scenarioContext.userData as UserRegistrationData;
  const response = await client.createAccount(userData);
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode };
  Logger.info(`Create account response: ${response.responseCode} - ${response.message}`);
});

When('I update the account via PUT updateAccount', async function (this: CustomWorld) {
  Logger.step('PUT /updateAccount');
  const client = getApiClient(this);
  const userData = this.scenarioContext.userData as UserRegistrationData;
  // Modify name slightly for update
  userData.firstName = `Updated_${userData.firstName}`;
  const response = await client.updateAccount(userData);
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode };
  Logger.info(`Update account response: ${response.responseCode} - ${response.message}`);
});

When('I retrieve the user details via GET getUserDetailByEmail', async function (this: CustomWorld) {
  Logger.step('GET /getUserDetailByEmail');
  const client = getApiClient(this);
  const userData = this.scenarioContext.userData as UserRegistrationData;
  const response = await client.getUserDetailByEmail(userData.email);
  (this as CustomWorld & { apiState: ApiTestState }).apiState = {
    lastResponseCode: response.responseCode,
    lastMessage: response.user?.email,
  };
  Logger.info(`Get user response: ${response.responseCode}`);
});

When('I delete the account via DELETE deleteAccount', async function (this: CustomWorld) {
  Logger.step('DELETE /deleteAccount');
  const client = getApiClient(this);
  const userData = this.scenarioContext.userData as UserRegistrationData;
  const response = await client.deleteAccount(userData.email, userData.password);
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode };
  Logger.info(`Delete account response: ${response.responseCode} - ${response.message}`);
});

When('I verify login with invalid credentials', async function (this: CustomWorld) {
  Logger.step('POST /verifyLogin (invalid creds)');
  const client = getApiClient(this);
  const invalidCreds = DataGenerator.generateInvalidCredentials();
  const response = await client.verifyLoginInvalid(invalidCreds.email, invalidCreds.password);
  (this as CustomWorld & { apiState: ApiTestState }).apiState = { messageResponse: response, lastResponseCode: response.responseCode, lastMessage: response.message };
});

// ─── THEN Steps ───────────────────────────────────────────────────────────────

function getState(world: CustomWorld): ApiTestState {
  return (world as CustomWorld & { apiState: ApiTestState }).apiState ?? {};
}

Then('the response code is 200', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(200);
});

Then('the response contains an array of products', async function (this: CustomWorld) {
  const state = getState(this);
  const response = state.productsResponse;
  expect(response).toBeDefined();
  expect(Array.isArray(response?.products)).toBeTruthy();
  expect((response?.products ?? []).length).toBeGreaterThan(0);
});

Then('each product has required fields: id, name, price, brand', async function (this: CustomWorld) {
  const state = getState(this);
  const products = state.productsResponse?.products ?? [];
  products.slice(0, 5).forEach((product) => {
    expect(typeof product.id).toBe('number');
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('string');
    expect(typeof product.brand).toBe('string');
  });
});

Then('the response code indicates method not allowed', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(405);
});

Then('the response message mentions request method not supported', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastMessage?.toLowerCase()).toContain('method not allowed');
});

Then('the response contains a list of brands', async function (this: CustomWorld) {
  const state = getState(this);
  const response = state.brandsResponse;
  expect(response).toBeDefined();
  expect(Array.isArray(response?.brands)).toBeTruthy();
  expect((response?.brands ?? []).length).toBeGreaterThan(0);
});

Then('each brand has required fields: id, brand', async function (this: CustomWorld) {
  const state = getState(this);
  const brands = state.brandsResponse?.brands ?? [];
  brands.slice(0, 5).forEach((brand) => {
    expect(typeof brand.id).toBe('number');
    expect(typeof brand.brand).toBe('string');
  });
});

Then('the search returns at least one matching product', async function (this: CustomWorld) {
  const state = getState(this);
  const products = state.searchResponse?.products ?? [];
  expect(products.length).toBeGreaterThan(0);
  Logger.info(`Search returned ${products.length} products`);
});

Then('the response code indicates a bad request', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(400);
});

Then('the response message mentions missing search product parameter', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastMessage?.toLowerCase()).toContain('search_product');
});

Then('the create account response code is 201', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(201);
});

Then('the update account response code is 200', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(200);
});

Then('the get user response code is 200', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(200);
});

Then('the retrieved user email matches the registered email', async function (this: CustomWorld) {
  const state = getState(this);
  const userData = this.scenarioContext.userData as UserRegistrationData;
  expect(state.lastMessage).toBe(userData.email);
});

Then('the delete account response code is 200', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(200);
});

Then('the response code indicates unauthorized access', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastResponseCode).toBe(403);
});

Then('the response message mentions invalid credentials', async function (this: CustomWorld) {
  const state = getState(this);
  expect(state.lastMessage?.toLowerCase()).toMatch(/user not found|email or password/);
});

import { APIRequestContext, APIResponse } from 'playwright';
import { Logger } from '../utils/logger';
import type {
  ProductsListResponse,
  BrandsListResponse,
  SearchProductResponse,
  UserDetailResponse,
  MessageResponse,
  UserRegistrationData,
} from '../utils/types';

export class ApiClient {
  private requestContext: APIRequestContext;
  private baseUrl: string;

  constructor(requestContext: APIRequestContext, baseUrl: string = 'https://www.automationexercise.com/api') {
    this.requestContext = requestContext;
    this.baseUrl = baseUrl;
  }

  private buildFormData(data: Record<string, string>): string {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  private async handleResponse<T>(response: APIResponse, endpoint: string): Promise<T> {
    const status = response.status();
    Logger.info(`${endpoint} → HTTP ${status}`);

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      Logger.error(`Failed to parse JSON response from ${endpoint}`, text);
      throw new Error(`Invalid JSON response from ${endpoint}: ${text}`);
    }
  }

  async getProductsList(): Promise<ProductsListResponse> {
    const response = await this.requestContext.get(`${this.baseUrl}/productsList`);
    return this.handleResponse<ProductsListResponse>(response, 'GET /productsList');
  }

  async postProductsListInvalid(): Promise<MessageResponse> {
    const response = await this.requestContext.post(`${this.baseUrl}/productsList`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: '',
    });
    return this.handleResponse<MessageResponse>(response, 'POST /productsList');
  }

  async getBrandsList(): Promise<BrandsListResponse> {
    const response = await this.requestContext.get(`${this.baseUrl}/brandsList`);
    return this.handleResponse<BrandsListResponse>(response, 'GET /brandsList');
  }

  async putBrandsListInvalid(): Promise<MessageResponse> {
    const response = await this.requestContext.put(`${this.baseUrl}/brandsList`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: '',
    });
    return this.handleResponse<MessageResponse>(response, 'PUT /brandsList');
  }

  async searchProduct(searchTerm: string): Promise<SearchProductResponse> {
    const formData = this.buildFormData({ search_product: searchTerm });
    const response = await this.requestContext.post(`${this.baseUrl}/searchProduct`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    return this.handleResponse<SearchProductResponse>(response, 'POST /searchProduct');
  }

  async searchProductWithoutParam(): Promise<MessageResponse> {
    const response = await this.requestContext.post(`${this.baseUrl}/searchProduct`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: '',
    });
    return this.handleResponse<MessageResponse>(response, 'POST /searchProduct (no param)');
  }

  async createAccount(userData: UserRegistrationData): Promise<MessageResponse> {
    const payload: Record<string, string> = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      title: userData.title,
      birth_date: userData.birthDay,
      birth_month: userData.birthMonth,
      birth_year: userData.birthYear,
      firstname: userData.firstName,
      lastname: userData.lastName,
      company: userData.company,
      address1: userData.address1,
      address2: userData.address2,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      zipcode: userData.zipcode,
      mobile_number: userData.mobileNumber,
    };
    const formData = this.buildFormData(payload);
    const response = await this.requestContext.post(`${this.baseUrl}/createAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    return this.handleResponse<MessageResponse>(response, 'POST /createAccount');
  }

  async updateAccount(userData: UserRegistrationData): Promise<MessageResponse> {
    const payload: Record<string, string> = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      title: userData.title,
      birth_date: userData.birthDay,
      birth_month: userData.birthMonth,
      birth_year: userData.birthYear,
      firstname: userData.firstName,
      lastname: userData.lastName,
      company: userData.company,
      address1: userData.address1,
      address2: userData.address2,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      zipcode: userData.zipcode,
      mobile_number: userData.mobileNumber,
    };
    const formData = this.buildFormData(payload);
    const response = await this.requestContext.put(`${this.baseUrl}/updateAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    return this.handleResponse<MessageResponse>(response, 'PUT /updateAccount');
  }

  async getUserDetailByEmail(email: string): Promise<UserDetailResponse> {
    const response = await this.requestContext.get(`${this.baseUrl}/getUserDetailByEmail`, {
      params: { email },
    });
    return this.handleResponse<UserDetailResponse>(response, 'GET /getUserDetailByEmail');
  }

  async deleteAccount(email: string, password: string): Promise<MessageResponse> {
    const formData = this.buildFormData({ email, password });
    const response = await this.requestContext.delete(`${this.baseUrl}/deleteAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    return this.handleResponse<MessageResponse>(response, 'DELETE /deleteAccount');
  }

  async verifyLoginInvalid(email: string, password: string): Promise<MessageResponse> {
    const formData = this.buildFormData({ email, password });
    const response = await this.requestContext.post(`${this.baseUrl}/verifyLogin`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    return this.handleResponse<MessageResponse>(response, 'POST /verifyLogin');
  }
}

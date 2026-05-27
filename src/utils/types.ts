// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  responseCode: number;
  message?: string;
  data?: T;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface Brand {
  id: number;
  brand: string;
}

export interface ProductsListResponse {
  responseCode: number;
  products: Product[];
}

export interface BrandsListResponse {
  responseCode: number;
  brands: Brand[];
}

export interface SearchProductResponse {
  responseCode: number;
  products: Product[];
}

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  title: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface UserDetailResponse {
  responseCode: number;
  user: UserDetail;
}

export interface MessageResponse {
  responseCode: number;
  message: string;
}

// ─── Test Data Types ──────────────────────────────────────────────────────────

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  title: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

// ─── World / Context Types ────────────────────────────────────────────────────

export interface ScenarioContext {
  userData?: UserRegistrationData;
  loginCredentials?: LoginCredentials;
  productName?: string;
  searchKeyword?: string;
}

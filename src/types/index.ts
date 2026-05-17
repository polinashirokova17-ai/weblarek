// src/types/index.ts

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// ===== ТИПЫ ДЛЯ МОДЕЛЕЙ =====

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type IFormErrors = Partial<Record<keyof IBuyer, string>>;

// ===== ТИПЫ ДЛЯ API =====

export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

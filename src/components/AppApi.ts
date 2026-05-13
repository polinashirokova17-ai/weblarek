// src/components/AppApi.ts
import { Api } from './base/Api';
import { IProduct, IOrder, IOrderResult, IProductsResponse } from '../types/index';

export class AppApi extends Api {
    private cdnUrl: string;

    constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl;
    }

    getProducts(): Promise<IProduct[]> {
        return this.get<IProductsResponse>('/product').then((data: IProductsResponse) => 
            data.items.map(item => ({
                ...item,
                image: this.cdnUrl + item.image
            }))
        );
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get<IProduct>(`/product/${id}`).then((item: IProduct) => ({
            ...item,
            image: this.cdnUrl + item.image
        }));
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post<IOrderResult>('/order', order);
    }
}
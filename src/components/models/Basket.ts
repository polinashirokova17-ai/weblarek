import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private items: Map<string, IProduct> = new Map();

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return Array.from(this.items.values());
    }

    addItem(product: IProduct): void {
        if (product.price !== null && !this.hasItem(product.id)) {
            this.items.set(product.id, product);
            this.events.emit('basket:changed', this.getItems());
        }
    }

    removeItem(id: string): void {
        this.items.delete(id);
        this.events.emit('basket:changed', this.getItems());
    }

    clear(): void {
        this.items.clear();
        this.events.emit('basket:changed', this.getItems());
    }

    getTotal(): number {
        let total = 0;
        this.items.forEach(item => {
            if (item.price !== null) {
                total += item.price;
            }
        });
        return total;
    }

    getCount(): number {
        return this.items.size;
    }

    hasItem(id: string): boolean {
        return this.items.has(id);
    }
}
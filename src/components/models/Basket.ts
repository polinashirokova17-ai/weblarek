import { IProduct } from '../../types';

export class Basket {
    private items: Map<string, IProduct> = new Map();

    getItems(): IProduct[] {
        return Array.from(this.items.values());
    }

    addItem(product: IProduct): void {
        if (product.price !== null && !this.hasItem(product.id)) {
            this.items.set(product.id, product);
        }
    }

    removeItem(id: string): void {
        this.items.delete(id);
    }

    clear(): void {
        this.items.clear();
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
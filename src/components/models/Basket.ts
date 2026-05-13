import { IProduct } from '../../types';

export class Basket {
    private _items: Map<string, IProduct> = new Map();

    // Получение массива товаров в корзине
    getItems(): IProduct[] {
        return Array.from(this._items.values());
    }

    // Добавление товара в корзину (только если есть цена)
    addItem(product: IProduct): void {
        if (product.price !== null && !this._items.has(product.id)) {
            this._items.set(product.id, product);
        }
    }

    // Удаление товара из корзины
    removeItem(id: string): void {
        this._items.delete(id);
    }

    // Очистка корзины
    clear(): void {
        this._items.clear();
    }

    // Получение стоимости всех товаров
    getTotal(): number {
        let total = 0;
        this._items.forEach(item => {
            if (item.price !== null) {
                total += item.price;
            }
        });
        return total;
    }

    // Получение количества товаров
    getCount(): number {
        return this._items.size;
    }

    // Проверка наличия товара по id
    hasItem(id: string): boolean {
        return this._items.has(id);
    }
}
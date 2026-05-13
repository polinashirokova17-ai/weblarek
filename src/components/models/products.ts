import { IProduct } from '../../types';

export class Products {
    private _items: IProduct[] = [];
    private _preview: string | null = null;

    setItems(items: IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setPreview(id: string | null): void {
        this._preview = id;
    }

    getPreview(): string | null {
        return this._preview;
    }
}
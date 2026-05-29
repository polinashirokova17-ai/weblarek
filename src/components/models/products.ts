import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private _items: IProduct[] = [];
    private _preview: string | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('products:changed', this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setPreview(id: string | null): void {
        this._preview = id;
        this.events.emit('preview:changed', id);
    }

    getPreview(): string | null {
        return this._preview;
    }
}
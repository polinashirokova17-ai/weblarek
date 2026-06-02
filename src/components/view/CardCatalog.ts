import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick?: () => void }) {
        super(container, actions);
        this._category = ensureElement('.card__category', container);
        this._image = ensureElement('.card__image', container);
    }

    set category(value: string) {
        this._category.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${modifier}`;
    }

    set image(value: string) {
        this._image.src = value;
        this._image.alt = this._title.textContent || '';
    }
}
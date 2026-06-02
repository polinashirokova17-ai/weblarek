import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onAddToBasket?: () => void }) {
        super(container, actions);
        this._description = ensureElement('.card__text', container);
        this._button = ensureElement('.card__button', container);
        this._category = ensureElement('.card__category', container);
        this._image = ensureElement('.card__image', container);

        if (actions?.onAddToBasket) {
            this._button.addEventListener('click', (e) => {
                e.stopPropagation();
                actions.onAddToBasket?.();
            });
        }
    }

    set description(value: string) {
        this._description.textContent = value;
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

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}
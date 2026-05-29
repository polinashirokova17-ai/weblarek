// src/components/view/CardPreview.ts
import { Card, ICardActions } from './Card';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions & { onAddToBasket?: () => void }) {
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

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}
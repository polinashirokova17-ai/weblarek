import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketActions {
    onRemove?: () => void;
}

export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected actions?: ICardBasketActions) {
        super(container, actions);
        this._index = ensureElement('.basket__item-index', container);
        this._deleteButton = ensureElement('.basket__item-delete', container);

        if (actions?.onRemove) {
            this._deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                actions.onRemove?.();
            });
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}
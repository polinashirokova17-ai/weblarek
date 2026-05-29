// src/components/view/CardBasket.ts
import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketActions {
    onRemove?: () => void;
}

export class CardBasket extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected actions?: ICardBasketActions) {
        super(container);
        this._title = ensureElement('.card__title', container);
        this._price = ensureElement('.card__price', container);
        this._index = ensureElement('.basket__item-index', container);
        this._deleteButton = ensureElement('.basket__item-delete', container);

        if (actions?.onRemove) {
            this._deleteButton.addEventListener('click', actions.onRemove);
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this._price.textContent = 'Бесценно';
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}
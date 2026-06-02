import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export abstract class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTLElement;

    constructor(protected container: HTMLElement, protected actions?: ICardActions) {
        super(container);
        this._title = ensureElement('.card__title', container);
        this._price = ensureElement('.card__price', container);
        
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
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
}
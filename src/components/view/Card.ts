import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onAddToBasket?: (event: MouseEvent) => void;
}

export abstract class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;

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

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${modifier}`;
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this._title.textContent || '';
        }
    }
}
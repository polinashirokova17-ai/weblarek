import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected _list: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement('.basket__list', container);
        this._button = ensureElement('.basket__button', container);
        this._price = ensureElement('.basket__price', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    set total(value: number) {
        this._price.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}
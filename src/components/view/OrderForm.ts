import { Form } from './Form';
import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IBuyer> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: any) {
        super(container, events);
        this._cardButton = container.querySelector('button[name="card"]');
        this._cashButton = container.querySelector('button[name="cash"]');
        this._addressInput = ensureElement('input[name="address"]', container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit('order.payment.select', { payment: 'card' });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order.payment.select', { payment: 'cash' });
        });
    }

    togglePayment(type: 'card' | 'cash') {
        const method = type === 'card' ? this._cardButton : this._cashButton;
        const other = type === 'card' ? this._cashButton : this._cardButton;
        method.classList.add('button_alt-active');
        other.classList.remove('button_alt-active');
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    protected getData(): Partial<IBuyer> {
        return {
            address: this._addressInput.value
        };
    }
}
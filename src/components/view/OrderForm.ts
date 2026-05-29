// src/components/view/OrderForm.ts
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
            this.togglePayment('card');
            this.onInputChange('payment', 'card');
        });

        this._cashButton.addEventListener('click', () => {
            this.togglePayment('cash');
            this.onInputChange('payment', 'cash');
        });
    }

    togglePayment(type: 'card' | 'cash') {
        const method = type === 'card' ? this._cardButton : this._cashButton;
        const other = type === 'card' ? this._cashButton : this._cardButton;
        method.classList.add('button_alt-active');
        other.classList.remove('button_alt-active');
    }

    protected getData(): Partial<IBuyer> {
        const payment = this._cardButton.classList.contains('button_alt-active') ? 'card' : 
                       this._cashButton.classList.contains('button_alt-active') ? 'cash' : null;
        return {
            payment,
            address: this._addressInput.value
        };
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}
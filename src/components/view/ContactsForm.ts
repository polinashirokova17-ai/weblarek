// src/components/view/ContactsForm.ts
import { Form } from './Form';
import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<IBuyer> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: any) {
        super(container, events);
        this._emailInput = ensureElement('input[name="email"]', container);
        this._phoneInput = ensureElement('input[name="phone"]', container);
    }

    protected getData(): Partial<IBuyer> {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}
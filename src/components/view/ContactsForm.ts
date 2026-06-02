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

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    protected getData(): Partial<IBuyer> {
        return {};
    }
}
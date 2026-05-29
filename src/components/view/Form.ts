// src/components/view/Form.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = ensureElement('button[type=submit]', container);
        this._errors = ensureElement('.form__errors', container);

        container.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`, this.getData());
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.field.change`, { field, value });
    }

    protected abstract getData(): Partial<T>;

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }

    render(data?: Partial<T> & { valid?: boolean; errors?: string }): HTMLElement {
        if (data?.valid !== undefined) this.valid = data.valid;
        if (data?.errors !== undefined) this.errors = data.errors;
        return super.render(data);
    }
}
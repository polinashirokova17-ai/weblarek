import { IBuyer, IFormErrors, TPayment } from '../../types';

export class Buyer {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    setField(field: keyof IBuyer, value: string): void {
        switch (field) {
            case 'payment':
                if (value === 'online' || value === 'cash') {
                    this._payment = value;
                }
                break;
            case 'address':
                this._address = value;
                break;
            case 'email':
                this._email = value;
                break;
            case 'phone':
                this._phone = value;
                break;
        }
    }

    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
            address: this._address,
            email: this._email,
            phone: this._phone,
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    validate(): IFormErrors {
        const errors: IFormErrors = {};

        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this._email.trim()) {
            errors.email = 'Укажите email';
        } else if (!/\S+@\S+\.\S+/.test(this._email)) {
            errors.email = 'Некорректный email';
        }

        if (!this._phone.trim()) {
            errors.phone = 'Укажите номер телефона';
        } else if (!/^[\d\s+()-]+$/.test(this._phone)) {
            errors.phone = 'Некорректный номер телефона';
        }

        return errors;
    }
}
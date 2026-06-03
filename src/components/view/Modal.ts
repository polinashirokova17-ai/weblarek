import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');

        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        this.events.emit('modal:close');
    }
}
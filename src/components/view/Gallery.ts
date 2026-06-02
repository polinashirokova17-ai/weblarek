import { Component } from '../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
// src/components/view/CardCatalog.ts
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: { onClick?: () => void }) {
        super(container, actions);
        this._category = ensureElement('.card__category', container);
        this._image = ensureElement('.card__image', container);
    }
}
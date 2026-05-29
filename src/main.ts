import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket as BasketView } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { IProduct, IOrder } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация событий и моделей
const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Инициализация API
const apiInstance = new Api(API_URL);
const appApi = new AppApi(apiInstance);

// DOM элементы
const gallery = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketIcon = ensureElement<HTMLButtonElement>('.header__basket');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

// Шаблоны
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Компоненты
const modal = new Modal(modalContainer, events);
let basketView: BasketView | null = null;

// === ОБНОВЛЕНИЕ КОРЗИНЫ ===
function updateBasketUI() {
    const items = basketModel.getItems();
    const count = basketModel.getCount();
    
    basketCounter.textContent = String(count);
    
    if (basketView) {
        if (items.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            basketView.items = [emptyMessage];
        } else {
            const basketItems = items.map((item, index) => {
                const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
                    onRemove: () => {
                        basketModel.removeItem(item.id);
                        updateBasketUI();
                        const updatedBasket = createBasketView();
                        if (basketView) {
                            basketView.items = updatedBasket.items;
                            basketView.total = updatedBasket.total;
                            basketView.buttonDisabled = updatedBasket.buttonDisabled;
                        }
                    }
                });
                card.title = item.title;
                card.price = item.price;
                card.index = index + 1;
                return card.render();
            });
            basketView.items = basketItems;
        }
        
        basketView.total = basketModel.getTotal();
        basketView.buttonDisabled = items.length === 0;
    }
}

// === СОЗДАНИЕ КОМПОНЕНТА КОРЗИНЫ ===
function createBasketView() {
    const container = cloneTemplate(basketTemplate);
    const view = new BasketView(container, events);
    basketView = view;
    
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    
    if (items.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        view.items = [emptyMessage];
    } else {
        const basketItems = items.map((item, index) => {
            const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
                onRemove: () => {
                    basketModel.removeItem(item.id);
                    updateBasketUI();
                    const updated = createBasketView();
                    if (basketView) {
                        basketView.items = updated.items;
                        basketView.total = updated.total;
                        basketView.buttonDisabled = updated.buttonDisabled;
                    }
                }
            });
            card.title = item.title;
            card.price = item.price;
            card.index = index + 1;
            return card.render();
        });
        view.items = basketItems;
    }
    
    view.total = total;
    view.buttonDisabled = items.length === 0;
    
    return view;
}

// === ОТОБРАЖЕНИЕ КАТАЛОГА ===
function renderCatalog(products: IProduct[]) {
    const cards = products.map(product => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                productsModel.setPreview(product.id);
            }
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        return card.render();
    });
    gallery.replaceChildren(...cards);
}

// === ОТОБРАЖЕНИЕ ПРЕВЬЮ ТОВАРА ===
function showPreview(productId: string) {
    const product = productsModel.getItem(productId);
    if (!product) return;
    
    const isInBasket = basketModel.hasItem(product.id);
    
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onAddToBasket: () => {
            if (isInBasket) {
                basketModel.removeItem(product.id);
                updateBasketUI();
                showPreview(productId);
            } else {
                basketModel.addItem(product);
                updateBasketUI();
                showPreview(productId);
            }
        }
    });
    
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    card.description = product.description;
    
    if (product.price === null) {
        card.buttonText = 'Недоступно';
        card.buttonDisabled = true;
    } else if (isInBasket) {
        card.buttonText = 'Удалить из корзины';
        card.buttonDisabled = false;
    } else {
        card.buttonText = 'В корзину';
        card.buttonDisabled = false;
    }
    
    modal.content = card.render();
    modal.open();
}

// === ПОКАЗ ФОРМЫ ЗАКАЗА ===
function showOrderForm() {
    const container = cloneTemplate(orderTemplate);
    const orderForm = new OrderForm(container as HTMLFormElement, events);
    
    const buyerData = buyerModel.getData();
    if (buyerData.payment) {
        orderForm.togglePayment(buyerData.payment);
    }
    if (buyerData.address) {
        orderForm.address = buyerData.address;
    }
    
    const errors = buyerModel.validate();
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = errors.payment || errors.address || '';
    
    modal.content = orderForm.render();
    modal.open();
}

// === ПОКАЗ ФОРМЫ КОНТАКТОВ ===
function showContactsForm() {
    const container = cloneTemplate(contactsTemplate);
    const contactsForm = new ContactsForm(container as HTMLFormElement, events);
    
    const buyerData = buyerModel.getData();
    if (buyerData.email) {
        contactsForm.email = buyerData.email;
    }
    if (buyerData.phone) {
        contactsForm.phone = buyerData.phone;
    }
    
    const errors = buyerModel.validate();
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = errors.email || errors.phone || '';
    
    modal.content = contactsForm.render();
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===

// Загрузка товаров с сервера
appApi.getProducts()
    .then(response => {
        const productsWithImages = response.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        productsModel.setItems(productsWithImages);
    })
    .catch(err => console.error('Ошибка загрузки товаров:', err));

// События от моделей
events.on('products:changed', (products: IProduct[]) => {
    renderCatalog(products);
});

events.on('preview:changed', (id: string | null) => {
    if (id) showPreview(id);
});

events.on('basket:changed', () => {
    updateBasketUI();
});

// События от представлений
events.on('basket:open', () => {
    const basketComponent = createBasketView();
    modal.content = basketComponent.render();
    modal.open();
});

events.on('order:start', () => {
    showOrderForm();
});

events.on('order:submit', (data: { payment: string; address: string }) => {
    buyerModel.setField('payment', data.payment);
    buyerModel.setField('address', data.address);
    showContactsForm();
});

events.on('order.field.change', (data: { field: string; value: string }) => {
    buyerModel.setField(data.field as keyof typeof data.field, data.value);
    const errors = buyerModel.validate();
    
    const orderForm = document.querySelector('.form[name="order"]') as HTMLFormElement;
    if (orderForm) {
        const errorsDiv = orderForm.querySelector('.form__errors');
        if (errorsDiv) {
            errorsDiv.textContent = errors.payment || errors.address || '';
        }
        const submitButton = orderForm.querySelector('button[type=submit]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = !!(errors.payment || errors.address);
        }
    }
});

events.on('contacts.field.change', (data: { field: string; value: string }) => {
    buyerModel.setField(data.field as keyof typeof data.field, data.value);
    const errors = buyerModel.validate();
    
    const contactsForm = document.querySelector('.form[name="contacts"]') as HTMLFormElement;
    if (contactsForm) {
        const errorsDiv = contactsForm.querySelector('.form__errors');
        if (errorsDiv) {
            errorsDiv.textContent = errors.email || errors.phone || '';
        }
        const submitButton = contactsForm.querySelector('button[type=submit]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = !!(errors.email || errors.phone);
        }
    }
});

events.on('contacts:submit', () => {
    const buyer = buyerModel.getData();
    const items = basketModel.getItems().map(item => item.id);
    const total = basketModel.getTotal();
    
    if (items.length === 0) return;
    
    const order: IOrder = {
        payment: buyer.payment,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: items,
        total: total
    };
    
    appApi.orderProducts(order)
        .then(result => {
            const successContainer = cloneTemplate(successTemplate);
            const success = new Success(successContainer, events);
            success.total = result.total;
            modal.content = success.render();
            
            basketModel.clear();
            buyerModel.clear();
            updateBasketUI();
        })
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
            const errorDiv = document.querySelector('.form__errors');
            if (errorDiv) {
                errorDiv.textContent = 'Ошибка оформления заказа. Попробуйте позже.';
            }
        });
});

events.on('success:close', () => {
    modal.close();
});

// Клик по иконке корзины
basketIcon.addEventListener('click', () => {
    events.emit('basket:open');
});
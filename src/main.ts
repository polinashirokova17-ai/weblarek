import "./scss/styles.scss";
import { Products } from "./components/models/products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { AppApi } from "./components/AppApi";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { Basket as BasketView } from "./components/view/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";
import { IProduct, IOrder } from "./types";
import { cloneTemplate, ensureElement } from "./utils/utils";

// Инициализация событий и моделей
const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Инициализация API
const apiInstance = new Api(API_URL);
const appApi = new AppApi(apiInstance);

// DOM элементы
const headerElement = ensureElement<HTMLElement>(".header");
const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

// Шаблоны
const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

// Создание экземпляров представлений (один раз)
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(
  cloneTemplate(orderTemplate) as HTMLFormElement,
  events,
);
const contactsForm = new ContactsForm(
  cloneTemplate(contactsTemplate) as HTMLFormElement,
  events,
);
const successView = new Success(cloneTemplate(successTemplate), events);
let currentPreviewCard: CardPreview | null = null;

// === ОБНОВЛЕНИЕ КОРЗИНЫ ===
function updateBasketUI() {
  const items = basketModel.getItems();
  const count = basketModel.getCount();

  // Обновляем счетчик в шапке
  header.counter = count;

  // Обновляем список товаров в корзине
  if (items.length === 0) {
    basketView.items = [];
  } else {
    const basketItems = items.map((item, index) => {
      const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
        onRemove: () => {
          events.emit("basket:remove", item.id);
        },
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

// === ОТОБРАЖЕНИЕ КАТАЛОГА ===
function renderCatalog(products: IProduct[]) {
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        productsModel.setPreview(product.id);
      },
    });
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    return card.render();
  });
  gallery.items = cards;
}

// === ОБНОВЛЕНИЕ ФОРМ НА ОСНОВЕ МОДЕЛИ ===
function updateFormsFromModel() {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  // Обновляем форму заказа
  if (buyer.address) {
    orderForm.address = buyer.address;
  }
  if (buyer.payment) {
    orderForm.togglePayment(buyer.payment);
  }
  orderForm.errors = errors.payment || errors.address || "";
  orderForm.valid = !errors.payment && !errors.address;

  // Обновляем форму контактов
  if (buyer.email) {
    contactsForm.email = buyer.email;
  }
  if (buyer.phone) {
    contactsForm.phone = buyer.phone;
  }
  contactsForm.errors = errors.email || errors.phone || "";
  contactsForm.valid = !errors.email && !errors.phone;
}

// === ОБНОВЛЕНИЕ ПРЕВЬЮ ===
function updatePreview() {
  const previewId = productsModel.getPreview();
  if (!previewId) return;

  const product = productsModel.getItem(previewId);
  if (!product) return;

  const isInBasket = basketModel.hasItem(product.id);

  if (!currentPreviewCard) {
    currentPreviewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onAddToBasket: () => {
        events.emit("preview:toggle", product.id);
      },
    });
  }

  currentPreviewCard.title = product.title;
  currentPreviewCard.price = product.price;
  currentPreviewCard.category = product.category;
  currentPreviewCard.image = product.image;
  currentPreviewCard.description = product.description;

  if (product.price === null) {
    currentPreviewCard.buttonText = "Недоступно";
    currentPreviewCard.buttonDisabled = true;
  } else if (isInBasket) {
    currentPreviewCard.buttonText = "Удалить из корзины";
    currentPreviewCard.buttonDisabled = false;
  } else {
    currentPreviewCard.buttonText = "В корзину";
    currentPreviewCard.buttonDisabled = false;
  }

  modal.content = currentPreviewCard.render();
  modal.open();
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===

// Загрузка товаров с сервера
appApi
  .getProducts()
  .then((response) => {
    const productsWithImages = response.items.map((item) => ({
      ...item,
      image: CDN_URL + item.image,
    }));
    productsModel.setItems(productsWithImages);
  })
  .catch((err) => console.error("Ошибка загрузки товаров:", err));

// События от моделей
events.on("products:changed", (products: IProduct[]) => {
  renderCatalog(products);
});

events.on("preview:changed", () => {
  updatePreview();
});

events.on("basket:changed", () => {
  updateBasketUI();
  updatePreview(); // Обновляем кнопку в превью если оно открыто
});

events.on("buyer:changed", () => {
  updateFormsFromModel();
});

// События от представлений
events.on("basket:open", () => {
  modal.content = basketView.render();
  modal.open();
});

events.on("basket:remove", (id: string) => {
  basketModel.removeItem(id);
});

events.on("preview:toggle", (productId: string) => {
  const product = productsModel.getItem(productId);
  if (!product) return;

  if (basketModel.hasItem(productId)) {
    basketModel.removeItem(productId);
  } else {
    basketModel.addItem(product);
  }
  modal.close();
});

events.on("order:start", () => {
  modal.content = orderForm.render();
  modal.open();
});

events.on("order.payment.select", (data: { payment: string }) => {
  buyerModel.setField("payment", data.payment);
});

events.on("order.field.change", (data: { field: string; value: string }) => {
  if (data.field === "address") {
    buyerModel.setField("address", data.value);
  }
});

events.on("order:submit", () => {
  modal.content = contactsForm.render();
});

events.on("contacts.field.change", (data: { field: string; value: string }) => {
  buyerModel.setField(data.field as keyof typeof data.field, data.value);
});

events.on("contacts:submit", () => {
  const buyer = buyerModel.getData();
  const items = basketModel.getItems().map((item) => item.id);
  const total = basketModel.getTotal();

  const order: IOrder = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    items: items,
    total: total,
  };

  appApi
    .orderProducts(order)
    .then((result) => {
      successView.total = result.total;
      modal.content = successView.render();
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
      const errorDiv = document.querySelector(".form__errors");
      if (errorDiv) {
        errorDiv.textContent = "Ошибка оформления заказа. Попробуйте позже.";
      }
    });
});

events.on("success:close", () => {
  modal.close();
});

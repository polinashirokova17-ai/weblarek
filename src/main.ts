import './scss/styles.scss';
import { Products } from './components/models/products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data';

console.log('=== ШАГ 3: ПРОВЕРКА МОДЕЛЕЙ ДАННЫХ ===');

// 1. Создание экземпляров классов
const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// 2. Тестирование Products
console.log('\n--- Тестирование Products ---');
productsModel.setItems(apiProducts.items);
console.log('getItems():', productsModel.getItems());
console.log('getItem(первый id):', productsModel.getItem(apiProducts.items[0].id));
productsModel.setPreview(apiProducts.items[0].id);
console.log('getPreview():', productsModel.getPreview());

// 3. Тестирование Basket
console.log('\n--- Тестирование Basket ---');
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
basketModel.addItem(apiProducts.items[2]); // price = null - не добавится
console.log('getItems():', basketModel.getItems());
console.log('getCount():', basketModel.getCount());
console.log('getTotal():', basketModel.getTotal());
console.log('hasItem(первый id):', basketModel.hasItem(apiProducts.items[0].id));
basketModel.removeItem(apiProducts.items[0].id);
console.log('После removeItem:', basketModel.getItems());
basketModel.clear();
console.log('После clear():', basketModel.getItems());

// 4. Тестирование Buyer
console.log('\n--- Тестирование Buyer ---');
buyerModel.setField('payment', 'online');
buyerModel.setField('address', 'г. Москва, ул. Тестовая, д. 1');
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+7 999 123-45-67');
console.log('getData():', buyerModel.getData());
console.log('validate() успех:', buyerModel.validate());

buyerModel.clear();
buyerModel.setField('email', 'wrong');
console.log('validate() с ошибками:', buyerModel.validate());

console.log('\n=== ШАГ 3 ЗАВЕРШЕН ===');

// ==============================================

console.log('\n=== ШАГ 4: ЗАПРОС К СЕРВЕРУ ===');

const api = new AppApi(API_URL, CDN_URL);

api.getProducts()
    .then(products => {
        console.log('Объект, полученный с сервера:', products);
        
        // Сохранение массива в модели данных
        productsModel.setItems(products);
        
        console.log('Массив сохранён в модели каталога:');
        console.log(productsModel.getItems());
    })
    .catch(err => {
        console.error('Ошибка запроса к серверу:', err);
    });

console.log('\n=== ШАГ 4 ЗАВЕРШЕН ===');
const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//cart

const buttonCart = document.querySelector('.button-cart'),
	modalCart = document.querySelector('#modal-cart'),
	modalClose = document.querySelector('.modal-close'),
	more = document.querySelector('.more'),
	navigationLink = document.querySelectorAll('.navigation-link'),
	longGoodsList = document.querySelector('.long-goods-list'),
	cartTableGoods = document.querySelector('.cart-table__goods'),
	cardTableTotal = document.querySelector('.card-table__total');


const getGoods = async () => { //функция для получения товаров
	const result = await fetch('db/db.json'); //получение из файла db.json
	if (!result.ok) {
		throw 'Ошибка! ' + result.status;
	}
	return result.json();
};

const cart = { // создание методов
	cartGoods: [{
			id: "099",
			name: "Часы Dior",
			price: 999,
			count: 2,
		},
		{
			id: "090",
			name: "Кеды",
			price: 23,
			count: 3,
		},
	], //массив для товаров
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({
			id,
			name,
			price,
			count
		}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => { //перебор с помощью reduce, первое значение записывает 0, далее то что возвращается
			return sum + (item.price * item.count); //первая итерация обрабатывает первый объект и значение возвращается в sum
		}, 0);

		cardTableTotal.textContent = totalPrice + '$'

	},
	deleteGood(id) { // метод для удаления товаров из корзины с объектами лучше использовать .f
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) { //убавить товар в корзине
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id) { //прибавить товар в корзине
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id) // find возвращает именно элемент
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({
					id,
					name,
					price
				}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					})
				})
		}
	},
}

document.body.addEventListener('click', event => { //получаем кнопку с ценой
	const addToCart = event.target.closest('.add-to-cart');
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
});

cartTableGoods.addEventListener('click', event => {
	const target = event.target;

	if (target.tagName === 'BUTTON') {
		const id = target.closest('.cart-item').dataset.id;
		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		};

		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		};
		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		};
	}
});

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeHandler); //зарытие модального окна по кнопке escape
};
const closeModal = () => {
	modalCart.classList.remove('show');
};

const escapeHandler = event => { //зарытие модального окна по кнопке escape
	if (event.code === 'Escape') {
		closeModal();
	};
};

buttonCart.addEventListener('click', openModal);

//Закрытие модального окна
modalCart.addEventListener('click', (event) => { //получаем элемент на котором был клик и помещаем в переменную event
	const target = event.target; //
	if (target.classList.contains('modal-close') || target === modalCart) { //проверяем, 
		closeModal();
	}
});


//добавление scroll smooth (плавный скролл)

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		});
	}
} {
	const more = document.querySelectorAll('a.more');

	for (const oneMore of more) {
		oneMore.addEventListener('click', function (event) {
			event.preventDefault();
			const id = oneMore.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		});
	}
}

//goods


const createCard = function ({
	label,
	name,
	img,
	description,
	id,
	price
}) { //функция для создания карточек,
	const card = document.createElement('div'); // в скобках получаем ключи объекта и проводим деструктуризацию, 
	card.className = 'col-lg-3 col-sm-6'; //сразу присваивая значения переменным (это описание к первой строке)


	card.innerHTML = `
		<div class="goods-card">
		${label ? `<span class="label">${label}</span>` : ''}
				
				<img src="db/${img}" alt="${name}" class="goods-image">
				<h3 class="goods-title">${name}</h3>
				<p class="goods-description">${description}</p>
				<button class="button goods-card-btn add-to-cart" data-id="${id}">
					<span class="button-price">$${price}</span>
				</button>
		</div>
		`;
	return card;
}

const renderCards = function (data) { //выводим полученные карточки на страницу 
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	// cards.forEach(function (card) { //получение карточек первый вариант
	// 	longGoodsList.append(card)
	// });
	longGoodsList.append(...cards); //получение с помощью оператора SPREAD
	document.body.classList.add('show-goods')
};

more.addEventListener('click', event => {
	event.preventDefault(); //убирает стандартное поведение браузера (не перезагружает страницу при событии)
	getGoods().then(renderCards);
	/*получаем ответ от сервера с данными состоящими из массива, затем вызывается функция renderCards, 
	в дата передаются данные с сервера  в строке 92 - каждый объект из массива добавляется в createCard, 
	созданны карточки и записанны в переменную cards и затем они отправляются на страницу в элемент longGoodsList*/
});

const filterCards = function (field, value) {
	getGoods()
		.then(data => data.filter(good => good[field] === value)) //функцианальное выражение
		.then(renderCards);
};

navigationLink.forEach(function (link) { //в link получаем все ссылки навигации 
	link.addEventListener('click', event => { //перебираем все ссылки навигации
		event.preventDefault();
		const field = link.dataset.field; //в значение field мы записывает содержимое дата атрибута
		const value = link.textContent;
		if (value !== 'All') {
			filterCards(field, value);
		} else {
			getGoods().then(renderCards);
		}
	})
});
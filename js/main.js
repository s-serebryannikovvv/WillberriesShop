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
	buttons = document.querySelectorAll('.button');

const getGoods = async () => { //функция для получения товаров
	const result = await fetch('db/db.json'); //получение из файла db.json
	if (!result.ok) {
		throw 'Ошибка! ' + result.status;
	}
	return result.json();
};

const openModal = () => {
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
})
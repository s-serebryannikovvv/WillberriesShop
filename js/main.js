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
	modalClose = document.querySelector('.modal-close');

const openModal = function () {
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeHandler); //зарытие модального окна по кнопке escape
};
const closeModal = function () {
	modalCart.classList.remove('show');
};

const escapeHandler = event => { //зарытие модального окна по кнопке escape
	if (event.code === 'Escape') {
		closeModal();
	};
};

buttonCart.addEventListener('click', openModal);

//Закрытие модального окна
modalCart.addEventListener('click', (event) => {//получаем элемент на котором был клик и помещаем в переменную event
	const target = event.target; //
	if (target.classList.contains('modal-close') || target === modalCart) { //проверяем, 
		closeModal();
	}
});


//добавление scroll smooth (плавный скролл)

(function () {
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', function (event) {
			event.preventDefault();
			const id = scrollLinks[i].getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		});
	}
})();

//goods

const more = document.querySelector('.more'),
	navigationItem = document.querySelectorAll('.navigation-item'),
	longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function () {//функция для получения данных
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка! ' + result.status;
	}
	return result.json();
};

const createCard = function (objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6'
	card.innerHTML = `
		<div class="goods-card">
				<span class="label">New</span>
				<img src="img/image-119.jpg" alt="image: Hoodie" class="goods-image">
				<h3 class="goods-title">Embroidered Hoodie</h3>
				<p class="goods-description">Yellow/Lilac/Fuchsia/Orange</p>
				<button class="button goods-card-btn add-to-cart" data-id="007">
					<span class="button-price">$89</span>
				</button>
		</div>
		`;
	return card;
}

const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	cards.forEach(function (card) {
		longGoodsList.append(card)
	});
	document.body.classList.add('show-goods')
};

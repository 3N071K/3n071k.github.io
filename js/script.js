// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
    });
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Обработчик формы
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const phone = form.querySelector('input[name="phone"]').value.replace(/\D/g, '');
    const name = form.querySelector('input[name="name"]').value || 'Гость';
    if (!phone) {
        alert('Пожалуйста, укажите номер телефона.');
        return;
    }
    const message = `Здравствуйте! Меня зовут ${name}, хочу заказать прогулку по Байкалу. Мой номер: ${phone}`;
    const waUrl = `https://wa.me/79642276716?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

// Модальное окно
const modalOverlay = document.getElementById('modalOverlay');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalOrderBtn = document.getElementById('modalOrderBtn');
const modalClose = document.getElementById('modalClose');

// Данные для модалок
const infoData = {
    'boat-nissan': {
        title: 'Катер Nissan GS «Байкал 1»',
        desc: 'Просторный двухмоторный катер с закрытой рубкой, которая одновременно служит кухней и столовой. На верхней открытой платформе – мягкие диваны и второй пост управления. Идеально для компании до 11 человек. На борту есть всё необходимое для отдыха: плита, холодильник, аудиосистема.',
        price: '15 000 ₽/час · 100 000 ₽/день',
        orderText: 'Интересует катер Байкал 1'
    },
    'boat-rib': {
        title: 'Катер Rib 85 RM CAB «Байкал 2»',
        desc: 'Быстроходный и манёвренный катер с превосходным панорамным обзором. Позволяет подходить почти вплотную к скалам, гротам и лежбищам нерп. Две открытые палубы, вместимость 11 человек. Отличный выбор для фотографов и исследователей дикой природы.',
        price: '13 500 ₽/час · 80 000 ₽/день',
        orderText: 'Интересует катер Байкал 2'
    },
    'shaman': {
        title: 'Шаман-камень',
        desc: 'Легендарная скала у истока Ангары, священное место бурятских шаманов. Считается, что здесь обитает дух хозяина реки. Энергетика этого места завораживает: вы увидите, как вода стремительно вырывается из Байкала, огибая камень.',
        price: '30 минут · 10 000 ₽',
        orderText: 'Заказ маршрута Шаман-камень'
    },
    'peschanaya': {
        title: 'Бухта Песчаная',
        desc: 'Знаменитая бухта с «ходульными» деревьями, корни которых подняты над землёй ветрами и водой. Белоснежный песок, тёплая вода и таёжные склоны создают пейзаж, напоминающий тропический рай. Прекрасное место для пикника и купания.',
        price: '7 часов · от 85 000 ₽',
        orderText: 'Заказ маршрута Бухта Песчаная'
    },
    'tunnel8': {
        title: 'Тоннель №8 «Толстый»',
        desc: 'Исторический тоннель Кругобайкальской железной дороги, пробитый в мысе Толстый. С ним связана драматическая легенда об инженере, покончившем с собой из-за ошибки в расчётах, хотя тоннель сошёлся. Место поражает своей архитектурой и видами.',
        price: '3 часа · 45 000 ₽',
        orderText: 'Заказ маршрута Тоннель №8'
    },
    'italyanskaya': {
        title: 'Итальянская стенка',
        desc: 'Одно из красивейших инженерных сооружений КБЖД, построенное итальянскими мастерами в 1905 году всего за три месяца. Высокая подпорная стена из камня, напоминающая крепость, эффектно смотрится на фоне байкальских просторов.',
        price: '3 часа · 45 000 ₽',
        orderText: 'Заказ маршрута Итальянская стенка'
    },
    'tunnel12': {
        title: 'Тоннель №12 Половинный',
        desc: 'Самый длинный и абсолютно прямой тоннель КБЖД, проходящий сквозь мыс Половинный. Насквозь виден свет в конце, что создаёт неповторимую атмосферу. Рядом открывается панорамный вид на Байкал и бухту.',
        price: '5 часов · 65 000 ₽',
        orderText: 'Заказ маршрута Тоннель №12'
    },
    'bolshie-koty': {
        title: 'Большие Коты, Утёс Скрипер',
        desc: 'Посёлок с уникальным музеем байкаловедения и аквариумом. Рядом возвышается 200-метровый утёс Скрипер с пещерой внутри. Живописные скалы и возможность увидеть байкальских обитателей в естественной среде.',
        price: '3 часа · 40 000 ₽',
        orderText: 'Заказ маршрута Большие Коты'
    },
    'mys-kapitanov': {
        title: 'Мыс Капитанов',
        desc: 'Тихий залив с рукотворным мысом, защищённым от ветра. Вода здесь прогревается сильнее, чем в среднем по Байкалу, что делает это место комфортным для купания. Идеально для спокойного семейного отдыха.',
        price: '5 часов · от 40 000 ₽',
        orderText: 'Заказ маршрута Мыс Капитанов'
    },
    'ushkani': {
        title: 'Ушканьи острова',
        desc: 'Заповедные острова, где на каменистых пляжах отдыхают сотни байкальских нерп. Высадка запрещена, но с катера вы сможете наблюдать за животными в бинокль или зрительную трубу. Уникальный шанс увидеть нерпу в естественной среде.',
        price: 'индивидуально · от 340 000 ₽',
        orderText: 'Заказ маршрута Ушканьи острова'
    }
};

// Функция открытия модалки
function openModal(infoKey, imgSrc) {
    const data = infoData[infoKey];
    if (!data) return;
    modalImg.src = imgSrc;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;
    modalOrderBtn.href = `https://wa.me/79642276716?text=${encodeURIComponent(data.orderText)}`;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модалки
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Обработчики кликов по карточкам
document.querySelectorAll('.card, .route-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Не открываем модалку, если клик был по кнопке внутри
        if (e.target.closest('a.btn')) return;
        const info = card.dataset.info;
        const img = card.querySelector('img');
        if (info && img) {
            openModal(info, img.src);
        }
    });
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Cookie-баннер
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');

if (!localStorage.getItem('cookieAccepted')) {
    cookieBanner.classList.remove('hidden');
}

cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'true');
    cookieBanner.classList.add('hidden');
});

// Анимация появления при скролле
const animatedElements = document.querySelectorAll('[data-animate], h2');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Для h2, которые не имеют data-animate, мы всё равно добавим .visible
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
});

animatedElements.forEach(el => observer.observe(el));

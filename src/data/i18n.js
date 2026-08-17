export const getLocale = pathname => (pathname.startsWith('/en') ? 'en' : 'ru')

const navigation = {
	ru: ['О франшизе', 'Форматы', 'Условия', 'Вопросы', 'Контакты'],
	en: ['About the franchise', 'Formats', 'Terms', 'FAQ', 'Contacts']
}

const hrefs = ['#about', '#formats', '#conditions', '#faq', '#contacts']

export const getNavigation = pathname =>
	navigation[getLocale(pathname)].map((label, index) => ({
		label,
		href: hrefs[index]
	}))

export const getLanguages = pathname => {
	const locale = getLocale(pathname)
	return [
		{ label: 'RU', href: '/', isActive: locale === 'ru' },
		{ label: 'EN', href: '/en', isActive: locale === 'en' }
	]
}

export const copy = {
	ru: {
		common: {
			apply: 'Оставить заявку',
			more: 'Узнать подробнее',
			contact: 'Связаться'
		},
		a11y: {
			mainNav: 'Основная навигация',
			extraNav: 'Дополнительная навигация',
			mobileNav: 'Мобильная навигация',
			language: 'Выбор языка',
			home: 'На главную',
			openMenu: 'Открыть меню',
			menu: 'Меню',
			close: 'Закрыть'
		},
		hero: {
			title: 'Франшиза Mr.BLACK',
			description:
				'Откройте кофейню Mr.Black в своем городе и зарабатывайте от 1 000 000 ₽ в год с рентабельностью 31%.',
			points: [
				['1–3 млн ₽', 'Чистая прибыль в год'],
				['57 млн ₽', 'Выручка сети за год']
			]
		},
		featuresTitle: 'Бизнес в точных цифрах',
		features: [
			{
				caption: 'обороты',
				value: '57 млн ₽',
				description: 'Общая выручка сети за прошлый год.'
			},
			{
				caption: 'география',
				value: '12+',
				description:
					'Точек успешно работают и генерируют стабильный поток гостей прямо сейчас.'
			},
			{
				caption: 'окупаемость',
				value: 'от 6',
				description:
					'Месяцев средний срок полного выхода партнера на окупаемость вложений.'
			},
			{
				caption: 'прибыль',
				value: '31%',
				description:
					'Чистая рентабельность кофейного бизнеса (выше среднерыночной на 7%).'
			}
		],
		formats: [
			{
				description:
					'Идеально для быстрого старта с минимальной площадью.',
				metrics: [
					['средняя прибыль', 'от 100 000 ₽/мес* '],
					['площадь', 'от 2 м²'],
					['Инвестиции', 'от 1 400 000 ₽*']
				]
			},
			{
				description:
					'Кофейня с небольшой посадкой и витриной для десертов. ',
				metrics: [
					['средняя прибыль', 'от 150 000 ₽/мес*'],
					['площадь', 'от 30 м²'],
					['Инвестиции', 'от 1 900 000 ₽*']
				]
			},
			{
				description:
					'Проект с кухней и особыми фото-зонами.',
				metrics: [
					['средняя прибыль', 'от 270 000 ₽/мес*'],
					['площадь', 'от 60 м²'],
					['Инвестиции', 'от 3 000 000 ₽* ']
				]
			}
		],
		package: {
			title: 'ГОТОВЫЙ БИЗНЕС ПОД КЛЮЧ',
			description:
				'Передаем проверенные инструменты, стандарты и многолетний опыт нашей команды для вашего уверенного старта.',
			items: [
				[
					'Авторское меню и техкарты',
					'Готовая технологическая база, регулярное обновление сезонных напитков.'
				],
				[
					'Поиск локации и дизайн-проект',
					'Поможем выбрать прибыльное место и разработаем планировку кофейни.'
				],
				[
					'Обучение команды',
					'Пошаговая программа подготовки бариста и управляющих с нуля.'
				],
				[
					'ТЕХНИКА И ИНВЕНТАРЬ',
					'Полностью укомплектуем вашу кофейню надежным оборудованием без переплат и лишних посредников.'
				],
				[
					'ФЕДЕРАЛЬНЫЕ ЗАКУПКИ',
					'Низкие цены на кофейное зерно, молоко и брендированные расходники за счет объемов и контрактов всей сети.'
				]
			]
		},
		terms: {
			caption: 'СОЗДАЕМ ТРЕНДЫ, А НЕ ПРОСТО ВАРИМ КОФЕ',
			title: 'Партнерство',
			badge: 'УСЛОВИЯ И ЦИФРЫ',
			description:
				'Наша финансовая модель полностью прозрачна, не содержит скрытых платежей, и направлена на то, чтобы вы максимально быстро вернули вложенный капитал.',
			highlights: ['открытая экономика', 'честные цифры'],
			items: [
				[
					'Инвестиции',
					'от 1.8 млн ₽',
					'Стартовый капитал для полного открытия, закупки оборудования и ремонта точки'
				],
				[
					'паушальный взнос',
					'390 000 ₽',
					'Стартовый капитал для полного открытия, закупки оборудования и ремонта точки.'
				],
				[
					'роялти',
					'4%',
					'Ежемесячный сбор, который начисляется только с 6-го месяца после открытия. Вы успеете выйти в плюс.'
				],
				[
					'окупаемость',
					'от 10 мес',
					'Плановый срок полного возврата ваших стартовых вложений.'
				],
				[
					'Чистая прибыль',
					'от 1 млн ₽/год',
					'Реальный чистый доход партнера с одной точки после вычета всех расходов.'
				]
			]
		},
		digital: {
			title: 'Бизнес в смартфоне',
			description:
				'Автоматизированная экосистема Mr.BLACK полностью исключает человеческий фактор. Вам больше не нужно жить в кофейне, чтобы контролировать прибыль.',
			cards: [
				[
					'Умный склад',
					'Система сама считает остатки стаканчиков, зерна и сиропов, автоматически отправляя точные заявки поставщикам.'
				],
				[
					'Прозрачные финансы',
					'Видеоконтроль кассовой зоны интегрирован со списаниями в CRM. Вы видите и контролируете каждое действие бариста.'
				],
				[
					'Глубокая аналитика',
					'Вы детально знаете предпочтения гостей: от точного времени визита до любимого сиропа в их вечернем латте.'
				]
			]
		},
		benefits: [
			[
				'Рост маржи',
				'Гарантируем +20% к прибыли исключительно за счет узнаваемости и высокой репутации бренда Mr.Black.'
			],
			[
				'Лояльная аудитория',
				'Постоянные клиенты, которые доверяют нашему качеству и возвращаются каждый день.'
			],
			[
				'Охват маркетинга',
				'Более 3 000 000 просмотров нашей рекламы в год благодаря креативному маркетингу, который ярко выделяется в индустрии.'
			]
		],
		faqIntro: 'ОТВЕЧАЕМ НА ГЛАВНЫЕ ВОПРОСЫ БУДУЩИХ ПАРТНЕРОВ.',
		faq: [
			[
				'Какая площадь нужна для запуска и как её правильно подобрать?',
				'Формату To go хватает 4 кв.м под стойку и 25 кв.м общей площади, Lounge требует от 65 кв.м, Specialty — от 95 кв.м. Локацию подбираем вместе: смотрим пеший трафик, соседей и стоимость аренды, а под конкретное помещение отдаём готовый дизайн-проект.'
			],
			[
				'Поместится ли всё необходимое оборудование всего на 4 кв.метрах?',
				'Да, комплект для To go собран именно под эту площадь: кофемашина, кофемолка, холодильник и рабочая поверхность встают в одну линию. Полный список техники с габаритами и схемой расстановки входит в пакет.'
			],
			[
				'В каких локациях формат мини-кофейни приносит больше всего прибыли?',
				'Бизнес-центры, вокзалы, крупные ТЦ и первые линии улиц с плотным пешим потоком. Решает не проходимость по бумагам, а количество людей, которые идут мимо точки каждый день по одному маршруту.'
			],
			[
				'Потребуются ли сложные согласования или перепланировка для такой площади?',
				'Как правило нет: формат не требует капитальных изменений и мокрых точек сверх уже имеющихся. Помогаем собрать документы для надзорных органов и проверяем помещение до того, как вы подпишете договор аренды.'
			],
			[
				'Какую поддержку получает партнёр после открытия?',
				'Обучение команды с нуля, регулярное обновление сезонного меню, федеральные цены на зерно, молоко и расходники за счёт объёмов сети и сопровождение управляющего на всём сроке работы.'
			]
		],
		cta: {
			title: 'ЗАРАБАТЫВАЙТЕ C MR.BLACK',
			description: 'Просто оставьте заявку и мы с вами свяжемся:',
			hint: 'Заполните информацию о вашей компании.'
		},
		form: {
			name: 'Имя*',
			namePlaceholder: 'Дмитрий',
			email: 'Почта*',
			phone: 'Телефон*',
			city: 'Город',
			cityPlaceholder: 'Москва',
			consent: 'Нажимая кнопку, я даю согласие на',
			privacy: 'обработку персональных данных',
			consentError: 'Подтвердите согласие',
			submit: 'Отправить'
		},
		cookies: {
			text: 'Пользуясь нашим сайтом, вы соглашаетесь с тем, что мы используем cookies',
			accept: 'Понятно',
			label: 'Уведомление о cookies'
		},
		notFound: {
			title: 'Mr.BLACK | Страница не найдена',
			text: 'Похоже, этой страницы больше не существует :(',
			back: 'Вернуться на главную',
			cupAlt: 'Стакан кофе Mr.BLACK'
		}
	},
	en: {
		common: {
			apply: 'Submit an application',
			more: 'Learn more',
			contact: 'Contact us'
		},
		a11y: {
			mainNav: 'Main navigation',
			extraNav: 'Additional navigation',
			mobileNav: 'Mobile navigation',
			language: 'Language selection',
			home: 'Home',
			openMenu: 'Open menu',
			menu: 'Menu',
			close: 'Close'
		},
		hero: {
			title: 'Mr.BLACK Franchise',
			description:
				'Open a Mr.BLACK coffee shop in your city and earn from ₽1,000,000 a year with a 31% margin.',
			points: [
				['₽ 1–3M', 'Net profit per year'],
				['₽ 57M', 'Annual network revenue']
			]
		},
		featuresTitle: 'Business in exact figures',
		features: [
			{
				caption: 'revenue',
				value: '₽ 57M',
				description: 'Total network revenue over the past year.'
			},
			{
				caption: 'geography',
				value: '12+',
				description:
					'Locations are already operating successfully and attracting a steady flow of guests.'
			},
			{
				caption: 'payback',
				value: 'from 6',
				description:
					'Months is the average time it takes a partner to fully recoup their investment.'
			},
			{
				caption: 'profit',
				value: '31%',
				description: 'Net coffee business margin — 7% above the market average.'
			}
		],
		formats: [
			{
				description:
					'Perfect for a fast launch with minimal space, starting from 4 m².',
				metrics: [
					['investment', 'from ₽250,000/mo'],
					['area', 'from 25 m²'],
					['payback', 'from ₽1,000,000']
				]
			},
			{
				description:
					'A full-size coffee shop with comfortable seating and a welcoming atmosphere for meetings and downtime.',
				metrics: [
					['investment', 'from ₽350,000/mo'],
					['area', 'from 65 m²'],
					['payback', 'from ₽2,000,000']
				]
			},
			{
				description:
					'A format for coffee connoisseurs, focused on beans, drink quality and barista expertise.',
				metrics: [
					['investment', 'from ₽550,000/mo'],
					['area', 'from 95 m²'],
					['payback', 'from ₽8,000,000']
				]
			}
		],
		package: {
			title: 'A TURNKEY BUSINESS',
			description:
				'We provide proven tools, standards and years of team experience for a confident launch.',
			items: [
				[
					'Signature menu and recipe cards',
					'A ready-to-use process base with regular seasonal drink updates.'
				],
				[
					'Location search and design',
					'We help select a profitable location and develop the coffee shop layout.'
				],
				[
					'Team training',
					'A step-by-step program that trains baristas and managers from scratch.'
				],
				[
					'EQUIPMENT AND INVENTORY',
					'We fully equip your coffee shop with reliable hardware, without markups or unnecessary middlemen.'
				],
				[
					'NATIONAL PROCUREMENT',
					'Low prices on coffee beans, milk and branded supplies through network-wide volumes and contracts.'
				]
			]
		},
		terms: {
			caption: 'WE SET TRENDS, NOT JUST BREW COFFEE',
			title: 'Partnership',
			badge: 'TERMS & FIGURES',
			description:
				'Our financial model is fully transparent, contains no hidden fees and is designed to help you recoup your investment as quickly as possible.',
			highlights: ['open economics', 'honest figures'],
			items: [
				[
					'Investment',
					'from ₽1.8M',
					'Starting capital for a complete launch, equipment purchase and renovation.'
				],
				[
					'initial fee',
					'₽390,000',
					'The one-time entry fee that gives you access to the brand, systems and launch support.'
				],
				[
					'royalty',
					'4%',
					'A monthly fee charged only from the sixth month after opening, giving you time to become profitable.'
				],
				[
					'payback',
					'from 10 mo.',
					'The projected period for fully recovering your initial investment.'
				],
				[
					'Net profit',
					'from ₽1M/year',
					'A partner’s real net income from one location after all expenses.'
				]
			]
		},
		digital: {
			title: 'Business in your smartphone',
			description:
				'The automated Mr.BLACK ecosystem removes the human factor. You no longer need to live at the coffee shop to stay in control of your profit.',
			cards: [
				[
					'Smart inventory',
					'The system tracks cups, beans and syrups, then automatically sends accurate orders to suppliers.'
				],
				[
					'Transparent finances',
					'Video monitoring of the checkout area is integrated with CRM write-offs, so every barista action is visible and controlled.'
				],
				[
					'Deep analytics',
					'Know guest preferences in detail — from visit times to the favorite syrup in their evening latte.'
				]
			]
		},
		benefits: [
			[
				'Margin growth',
				'Gain an extra 20% in profit through the recognition and strong reputation of the Mr.BLACK brand.'
			],
			[
				'Loyal audience',
				'Regular customers trust our quality and return every day.'
			],
			[
				'Marketing reach',
				'More than 3,000,000 annual ad views driven by distinctive creative marketing.'
			]
		],
		faqIntro: 'ANSWERS TO THE KEY QUESTIONS FROM FUTURE PARTNERS.',
		faq: [
			[
				'How much space is needed and how do I choose the right location?',
				'To go needs 4 m² for the counter and 25 m² overall, Lounge starts at 65 m², and Specialty at 95 m². We assess foot traffic, neighboring businesses and rent, then provide a design tailored to the selected premises.'
			],
			[
				'Can all the necessary equipment really fit into 4 m²?',
				'Yes. The To go equipment set is designed for this footprint: the espresso machine, grinder, refrigerator and worktop fit into a single line. The package includes a full equipment list, dimensions and layout.'
			],
			[
				'Which locations are most profitable for a mini coffee shop?',
				'Business centers, railway stations, major shopping malls and busy street-front locations. What matters is not claimed traffic, but the number of people following the same route past the location every day.'
			],
			[
				'Will this format require complex approvals or remodeling?',
				'Usually not. The format does not require structural alterations or additional wet areas. We help prepare regulatory documents and check the premises before you sign the lease.'
			],
			[
				'What support does a partner receive after opening?',
				'Team training from scratch, seasonal menu updates, national prices on beans, milk and supplies, plus operational support throughout the partnership.'
			]
		],
		cta: {
			title: 'EARN WITH MR.BLACK',
			description: 'Simply submit an application and we will contact you:',
			hint: 'Fill in the information about your company.'
		},
		form: {
			name: 'Name*',
			namePlaceholder: 'John',
			email: 'Email*',
			phone: 'Phone*',
			city: 'City',
			cityPlaceholder: 'London',
			consent: 'By clicking the button, I consent to the',
			privacy: 'processing of personal data',
			consentError: 'Please confirm your consent',
			submit: 'Send'
		},
		cookies: {
			text: 'By using our site, you agree that we use cookies',
			accept: 'Got it',
			label: 'Cookie notice'
		},
		notFound: {
			title: 'Mr.BLACK | Page not found',
			text: 'Looks like this page no longer exists :(',
			back: 'Back to home',
			cupAlt: 'Mr.BLACK coffee cup'
		}
	}
}

export const getCopy = pathname => copy[getLocale(pathname)]

import { getLocale } from './i18n.js'

const stubSections = {
	ru: [
		{
			title: '1. Общие положения',
			paragraphs: [
				'Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» (далее — Закон о персональных данных) и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые Оператором.',
				'1.1. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.',
				'1.2. Настоящая политика Оператора в отношении обработки персональных данных (далее — Политика) применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта.'
			]
		},
		{
			title: '2. Основные понятия, используемые в Политике',
			paragraphs: [
				'2.1. Автоматизированная обработка персональных данных — обработка персональных данных с помощью средств вычислительной техники.',
				'2.2. Блокирование персональных данных — временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных).',
				'2.3. Веб-сайт — совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, обеспечивающих их доступность в сети интернет.'
			]
		}
	],
	en: [
		{
			title: '1. General provisions',
			paragraphs: [
				'This personal data processing policy is drawn up in accordance with the requirements of Federal Law No. 152-FZ of 27 July 2006 “On Personal Data” and defines the procedure for processing personal data and the measures taken by the Operator to keep personal data secure.',
				'1.1. The Operator considers it a priority to respect human and civil rights and freedoms when processing personal data, including the protection of the right to privacy and to personal and family confidentiality.',
				'1.2. This policy applies to all information that the Operator may obtain about visitors to the website.'
			]
		},
		{
			title: '2. Key terms used in the Policy',
			paragraphs: [
				'2.1. Automated processing of personal data — processing of personal data by means of computing equipment.',
				'2.2. Blocking of personal data — temporary suspension of processing of personal data (except where processing is required to clarify the personal data).',
				'2.3. Website — a set of graphic and information materials, as well as software and databases, that make them available online.'
			]
		}
	]
}

const documents = {
	ru: {
		terms: {
			title: 'Политика в отношении обработки персональных данных',
			sections: stubSections.ru
		},
		privacy: {
			title: 'Политика конфиденциальности',
			sections: stubSections.ru
		}
	},
	en: {
		terms: {
			title: 'Personal data processing policy',
			sections: stubSections.en
		},
		privacy: {
			title: 'Privacy policy',
			sections: stubSections.en
		}
	}
}

export const getLegal = pathname => documents[getLocale(pathname)]

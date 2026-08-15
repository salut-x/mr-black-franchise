// Форма объекта = поля коллекции Strapi `features` (caption / value / description).
// При подключении CMS заменить на: const features = await fetchAPI('/features')
export const features = [
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
		value: 'от 6 ',
		description:
			'Месяцев средний срок полного выхода партнера на окупаемость вложений.'
	},
	{
		caption: 'прибыль',
		value: '31%',
		description:
			'Чистая рентабельность кофейного бизнеса (выше среднерыночной на 7%).'
	}
]

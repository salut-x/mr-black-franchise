# mr-black-franchise

Минимальный стартовый каркас для новых сайтов на Astro: базовый layout, адаптивное меню и независимые UI-компоненты.

## Запуск

```sh
npm install
npm run dev
```

Сборка для production:

```sh
npm run build
```

## Структура

```text
src/
├── components/
│   ├── base/       # элементы каркаса (burger)
│   ├── partials/   # Head и Header
│   └── ui/         # компоненты, подключаемые по необходимости
├── layouts/        # BaseLayout
├── pages/          # маршруты Astro
├── scripts/        # небольшой JS только для интерактивности
└── styles/         # токены, reset, mixins и общие стили
```

## UI-компоненты

- `Button.astro` — кнопка или ссылка. Поддерживает `variant='primary' | 'secondary'`.
- `Accordion.astro` — нативный accordion на `<details>`; передайте `title` и содержимое в слот.
- `Form.astro` — стилизованная обёртка формы. Поля и кнопку передавайте в слот.
- `Modal.astro` — нативный `<dialog>`. Дайте ему `id`, а на кнопку-открыватель добавьте `data-modal-open='ваш-id'`.

Примеры всех компонентов доступны на главной странице. Компонент подключается обычным импортом — удалять неиспользуемые компоненты не требуется: Astro не добавляет их в production-сборку.

## Перед новым проектом

1. Обновите `title` и `description` на `src/pages/index.astro`.
2. Настройте ссылки в `src/components/partials/Header.astro`.
3. Удалите демонстрационный контент главной страницы и добавьте секции проекта.
4. При деплое укажите `site` в `astro.config.mjs`, чтобы сгенерировать canonical URL и sitemap.

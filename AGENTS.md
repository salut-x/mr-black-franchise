# Code style

Use `InputMaskCollection.js` and `OverlayMenu.js` from the Stream Vibe study
project as the reference style for browser-side JavaScript.

## Clarification before implementation

- Always ask clarifying questions before implementation when any visual,
  behavioral, responsive, content, or technical requirement is ambiguous.
- If a result cannot be determined confidently from a screenshot, Figma frame,
  video, reference site, or short description, ask the user instead of
  experimenting or choosing a subjective interpretation.
- For animation work, clarify direction, distance, duration, delay, stagger,
  easing, and which existing animations must remain unchanged whenever those
  details are not evident from the reference.
- Before changing a shared component, clarify the intended scope when the
  request could apply to only one state, breakpoint, theme, or nested element.
- Do not broaden a requested visual adjustment to adjacent elements without
  confirmation.

## JavaScript modules

- Implement an interactive UI feature as a small ES class with one clear
  responsibility.
- Store DOM selectors in a `selectors` class field. Use semantic
  `data-js-*` attributes as the JavaScript-to-markup contract.
- Store CSS state names in a `stateClasses` class field instead of repeating
  string literals.
- Cache repeatedly used DOM nodes on the instance with descriptive names such
  as `rootElement`, `dialogElement`, and `burgerButtonElement`.
- Let the constructor only collect required state and start initialization or
  event binding.
- Put setup in `init()` and event registration in `bindEvents()` when those
  phases exist.
- Name handlers after the event and source, for example
  `onBurgerButtonClick`.
- Define handlers that are passed as callbacks as arrow class fields so that
  they preserve the instance context.
- For repeated widgets, use a small class for one widget and a separate
  `*Collection` class that discovers and initializes all matching elements.
- Keep methods short, direct, and ordered by lifecycle: constructor, handlers,
  initialization/event binding.
- Export the public module class as the default export.
- Avoid comments that merely repeat what the code says. Prefer expressive
  selectors, fields, and method names.

## Formatting

- Follow the existing project formatting: tabs in `.astro` files and single
  quotes in JavaScript/Astro code.
- Omit semicolons.
- Include trailing commas in multiline objects and argument lists where the
  syntax permits.
- Break long expressions and DOM queries across lines for readability.

## BEM naming

- Use strict BEM for all component and section markup and styles.
- Name blocks by their UI responsibility, for example `hero`, `contact-form`,
  or `accordion`.
- Name elements with a double underscore: `hero__title`,
  `contact-form__field`.
- Name modifiers with a double hyphen: `button--dark`, `header--sticky`.
- Keep element names flat. Use `card__icon`, not `card__header__icon`, even
  when the markup is nested.
- Do not create a BEM element class unless it is needed for styling, layout,
  testing, or a clear component contract.
- Prefer a separate block when a nested part is reusable or has its own
  responsibility.
- Combine blocks when appropriate: an element may also be the root of another
  block.
- Use state classes such as `is-active`, `is-open`, and `is-lock` for temporary
  UI state. Do not encode temporary state as a BEM modifier.
- Keep JavaScript hooks separate from styling: query semantic `data-js-*`
  attributes, not BEM classes.
- Component styles must target BEM classes, modifiers, state classes, or
  dedicated `data-*` state attributes. Do not target a nested element by its
  tag name or with a universal selector, for example `.header__nav ul`,
  `.menu__dots span`, or `.logo *`. Give every styled node its own BEM element
  class instead.
- Tag and universal selectors are allowed only in global reset/base styles,
  never in component-specific styles.
- Do not nest an independent block under another block selector only to create
  context. Style the nested block at the top level or use an explicit mix or
  modifier class.
- Avoid styling by IDs and avoid deeply nested selectors. Nest Sass only while
  the compiled selector remains clear, class-based, and predictable.

## SCSS

- Write project styles in SCSS. Use `<style lang='scss'>` in Astro components
  and `.scss` files for shared styles.
- Keep component-specific styles colocated with their `.astro` component.
- Put shared tokens, functions, mixins, breakpoints, resets, and utility
  classes in `src/styles`.
- Reuse existing CSS custom properties from `src/styles/_tokens.scss` instead
  of repeating colors, fonts, spacing rules, and transition durations.
- Import shared Sass helpers with `@use '../../styles/helpers' as *`, adjusting
  the relative path for the current file.
- Use the existing mobile-first media mixins: base styles for mobile, then
  `@include tablet` and `@include desktop` where needed.
- Use the existing `hover` mixin for hover-capable devices rather than a bare
  `:hover` when touch behavior matters.
- Nest selectors around the BEM block with `&__element` and `&--modifier`, but
  keep nesting shallow and avoid changing specificity unintentionally.
- Use `:global(...)` only when an Astro scoped style must reach markup rendered
  inside another component, such as an inline SVG from `Icon.astro`.
- Prefer CSS custom properties for runtime/theme values and Sass variables or
  functions for build-time calculations.
- Do not use inline `style` attributes for regular presentation.

Apply these rules to new code and to files being substantially edited. Do not
mechanically rewrite unrelated existing code only to normalize style.

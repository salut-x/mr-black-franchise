import IMask from 'imask'

const selectors = {
	form: '[data-js-form]',
	phone: '[data-js-form-phone]',
	error: '[data-js-form-error]',
	status: '[data-js-form-status]',
}

const stateClasses = {
	invalid: 'is-invalid',
}

const translations = {
	ru: {
		messages: { valueMissing: 'Заполните поле', typeMismatch: 'Нужен адрес вида mr.black@gmail.com', patternMismatch: 'Нужен адрес вида mr.black@gmail.com' },
		phone: 'Введите номер полностью',
		fallback: 'Проверьте поле',
		success: 'Заявка отправлена, мы свяжемся с вами'
	},
	en: {
		messages: { valueMissing: 'Please fill in this field', typeMismatch: 'Enter an email like mr.black@gmail.com', patternMismatch: 'Enter an email like mr.black@gmail.com' },
		phone: 'Enter the full phone number',
		fallback: 'Please check this field',
		success: 'Application sent. We will contact you shortly'
	}
}

const phoneMaskOptions = {
	mask: '+{7} (000) 000-00-00',
	prepare: (appended, masked) =>
		masked.value === '' ? appended.replace(/^[78]/, '') : appended,
}

class ContactForm {
	constructor(formElement) {
		this.formElement = formElement
		this.statusElement = formElement.querySelector(selectors.status)
		this.isValidated = false
		this.translation = translations[document.documentElement.lang] ?? translations.ru

		this.formElement.noValidate = true

		this.initPhoneMask()
		this.formElement.addEventListener('submit', this.onSubmit)
		this.formElement.addEventListener('input', this.onInput)
	}

	initPhoneMask() {
		this.phoneElement = this.formElement.querySelector(selectors.phone)

		if (!this.phoneElement) {
			return
		}

		this.phoneMask = IMask(this.phoneElement, phoneMaskOptions)
		this.phoneMask.on('accept', this.onPhoneAccept)
	}

	onPhoneAccept = () => {
		this.phoneElement.setCustomValidity(
			!this.phoneMask.value || this.phoneMask.masked.isComplete
				? ''
				: this.translation.phone,
		)
	}

	onSubmit = event => {
		event.preventDefault()
		this.isValidated = true

		const invalidElements = this.getFieldElements().filter(
			fieldElement => !this.renderField(fieldElement),
		)

		if (invalidElements.length) {
			this.setStatus('')
			invalidElements[0].focus()
			return
		}

		this.formElement.reset()

		if (this.phoneMask) {
			this.phoneMask.value = ''
		}

		this.isValidated = false
		this.setStatus(this.translation.success)
	}

	onInput = event => {
		if (this.isValidated && event.target.willValidate) {
			this.renderField(event.target)
		}
	}

	getFieldElements() {
		return Array.from(this.formElement.elements).filter(
			element => element.willValidate,
		)
	}

	getMessage(fieldElement) {
		const { validity, validationMessage, dataset } = fieldElement

		if (validity.customError) {
			return validationMessage
		}

		if (dataset.error) {
			return dataset.error
		}

		const rule = Object.keys(this.translation.messages).find(name => validity[name])

		return this.translation.messages[rule] ?? this.translation.fallback
	}

	renderField(fieldElement) {
		const isValid = fieldElement.validity.valid
		const wrapperElement = fieldElement.closest('label') ?? fieldElement
		const errorElement = wrapperElement.querySelector(selectors.error)

		wrapperElement.classList.toggle(stateClasses.invalid, !isValid)
		fieldElement.setAttribute('aria-invalid', String(!isValid))

		if (errorElement) {
			errorElement.textContent = isValid ? '' : this.getMessage(fieldElement)
		}

		return isValid
	}

	setStatus(message) {
		if (this.statusElement) {
			this.statusElement.textContent = message
		}
	}
}

function initForms() {
	document
		.querySelectorAll(selectors.form)
		.forEach(formElement => new ContactForm(formElement))
}

export default initForms

import { getTextContent, setBackgroundImage, setFieldValues } from './common'
import * as yup from 'yup'

function setFormValues(formSelector, formValue) {
	setFieldValues(formSelector, '[name="title"]', formValue?.title)
	setFieldValues(formSelector, '[name="author"]', formValue?.author)
	setFieldValues(formSelector, '[name="description"]', formValue?.description)
	setFieldValues(formSelector, '[name="imageUrl"]', formValue?.imageUrl)
	setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

function getFormValues(formSelector) {
	const formValues = {}
	// S1
	// ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
	// 	const field = formSelector.querySelector(`[name="${name}"]`)
	// 	if (field) formValues[name] = field.value
	// })

	// S2: use formData
	const formData = new FormData(formSelector)
	for (const [key, value] of formData) {
		formValues[key] = value
	}
	return formValues
}

function getPostSchema() {
	return yup.object().shape({
		title: yup.string().required('Please enter the title'),
		author: yup
			.string()
			.required('Please enter the author')
			.test(
				'more-than-two-words',
				'Author name is more than two words',
				(val) => val.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
			),
		description: yup.string(),
	})
}

function setFieldError(form, name, error) {
	const field = form.querySelector(`[name="${name}"]`)
	if (field) {
		field.setCustomValidity(error)
		getTextContent(field.parentElement, '.invalid-feedback', error)
	}
}

async function validatePostForm(form, formValues) {
	try {
		;['title', 'author'].forEach((name) => setFieldError(form, name, ''))
		const schema = getPostSchema()
		await schema.validate(formValues, { abortEarly: false })
	} catch (error) {
		// TODO: Study about validation in JS
		const errorLog = {}
		if (error.name === 'ValidationError') {
			for (const validationError of error.inner) {
				const name = validationError.path
				const message = validationError.message
				if (errorLog[name]) continue
				setFieldError(form, name, message)
				errorLog[name] = true
			}
		}
	}

	const isValid = form.checkValidity()
	if (!isValid) form.classList.add('was-validated')

	return isValid
}

function showLoading(form) {
	const saveBtn = form.querySelector('[name="save"]')
	if (saveBtn) {
		saveBtn.disabled = true
		saveBtn.textContent = 'Saving...'
	}
}

function hideLoading(form) {
	const saveBtn = form.querySelector('[name="save"]')
	if (saveBtn) {
		saveBtn.disabled = false
		saveBtn.textContent = 'Save'
	}
}

export function form({ formId, formValue, onSubmit }) {
	const formSelector = document.getElementById(formId)
	if (!formSelector) return

	let isSubmitting = false

	setFormValues(formSelector, formValue)
	formSelector.addEventListener('submit', async (e) => {
		e.preventDefault()

		if (isSubmitting) return

		showLoading(formSelector)
		isSubmitting = true

		const formValues = getFormValues(formSelector)
		formValues.id = formValue.id

		const isValid = await validatePostForm(formSelector, formValues)
		if (!isValid) return

		await onSubmit?.(formValues)

		hideLoading(formSelector)
		isSubmitting = false
	})
}

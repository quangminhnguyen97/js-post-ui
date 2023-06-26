import { getRandomNumber, getTextContent, setBackgroundImage, setFieldValues } from './common'
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
		imageUrl: yup.string().required('Please enter the URL image').url('Please enter the link'),
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
		;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))
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

function initImagery(formSelector) {
	const buttonChange = document.getElementById('postChangeImage')
	if (buttonChange) {
		buttonChange.addEventListener('click', () => {
			// generate new url
			const url = `https://picsum.photos/id/${getRandomNumber(1000)}/1368/400`
			// set form
			setFieldValues(formSelector, '[name="imageUrl"]', url)
			setBackgroundImage(document, '#postHeroImage', url)
		})
	}
}

function showHideOptions(form, value) {
	const imgSourcesList = form.querySelectorAll(`[name="imageSources"]`)

	imgSourcesList.forEach((div) => {
		const needToShow = value === div.dataset.standfor
		console.log(value, div.dataset.standfor, needToShow)
		if (!needToShow) div.hidden = true
		else div.hidden = false
	})
}

function initRadioImage(formSelector) {
	const inputList = document.querySelectorAll('[name="imageChoices"]')
	if (!inputList) return

	inputList.forEach((choice) => {
		choice.addEventListener('change', (event) => {
			showHideOptions(formSelector, event.target.value)
		})
	})
}

export function form({ formId, formValue, onSubmit }) {
	const formSelector = document.getElementById(formId)
	if (!formSelector) return

	let isSubmitting = false

	setFormValues(formSelector, formValue)

	initImagery(formSelector)
	initRadioImage(formSelector)

	formSelector.addEventListener('submit', async (e) => {
		e.preventDefault()

		if (isSubmitting) return

		showLoading(formSelector)
		isSubmitting = true

		const formValues = getFormValues(formSelector)
		formValues.id = formValue.id

		const isValid = await validatePostForm(formSelector, formValues)
		if (isValid) await onSubmit?.(formValues)

		hideLoading(formSelector)
		isSubmitting = false
	})
}

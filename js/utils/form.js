import { getRandomNumber, getTextContent, setBackgroundImage, setFieldValues } from './common'
import * as yup from 'yup'

const ImageSource = {
	PICSUM: 'picsum',
	UPLOAD: 'upload',
}

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
		imageSource: yup
			.string()
			.oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),

		imageUrl: yup.string().when('imageSource', {
			is: (val) => val === ImageSource.PICSUM,
			then: (schema) =>
				schema.test(
					'required',
					'Please enter the URL image',
					(val) => !!val.includes('https')
				),
		}),

		image: yup.mixed().when('imageSource', {
			is: (val) => val === ImageSource.UPLOAD,
			then: (schema) =>
				schema
					.test('required', 'Please select an image to upload', (value) =>
						Boolean(value?.name)
					)
					.test('maximum upload', 'File size must be lower 5MB', (file) => {
						const MAX_FILE_SIZE = 5 * 1024 * 1024
						return file.size <= MAX_FILE_SIZE
					}),
		}),
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
		;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))
		const schema = getPostSchema()
		await schema.validate(formValues, { abortEarly: false })
	} catch (error) {
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

async function validateFormField(form, value, name) {
	try {
		setFieldError(form, name, '')

		const schema = getPostSchema()
		await schema.validateAt(name, value)
	} catch (error) {
		setFieldError(form, name, error)
	}

	const selectElm = form.querySelector(`[name="${name}"]`)
	if (selectElm && !selectElm.checkValidity()) {
		const containerElm = selectElm.parentElement
		containerElm.classList.add('was-validated')
	}
}

function attachChosseFile(formSelector) {
	const inputElm = formSelector.querySelector('[name="image"]')
	if (!inputElm) return
	inputElm.addEventListener('change', (e) => {
		const image = e.target.files[0]
		if (!image) return
		const url = URL.createObjectURL(image)
		setBackgroundImage(document, '#postHeroImage', url)
		validateFormField(formSelector, { imageSource: ImageSource.UPLOAD, image: image }, 'image')
	})
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
	const imgSourcesList = form.querySelectorAll(`[data-id="imageSource"]`)
	imgSourcesList.forEach((control) => {
		const needToShow = value === control.dataset.standfor
		if (!needToShow) control.hidden = true
		else control.hidden = false
	})
}

function initRadioImage(formSelector) {
	const radioList = formSelector.querySelectorAll('[name="imageSource"]')
	if (!radioList) return

	radioList.forEach((choice) => {
		choice.addEventListener('change', (event) => {
			showHideOptions(formSelector, event.target.value)
		})
	})
}

function initValidateFormField(formSelector) {
	;['title', 'author'].forEach((name) => {
		const elm = formSelector.querySelector(`[name="${name}"]`)
		elm.addEventListener('input', (event) => {
			validateFormField(formSelector, { [name]: event.target.value }, name)
		})
	})
}

export function form({ formId, formValue, onSubmit }) {
	const formSelector = document.getElementById(formId)
	if (!formSelector) return

	let isSubmitting = false

	setFormValues(formSelector, formValue)

	initImagery(formSelector)
	attachChosseFile(formSelector)
	initRadioImage(formSelector)
	initValidateFormField(formSelector)

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

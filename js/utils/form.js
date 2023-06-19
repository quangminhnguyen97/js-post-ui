import { setBackgroundImage, setFieldValues } from './common'

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

export function form({ formId, formValue, onSubmit }) {
	const formSelector = document.getElementById(formId)
	if (!formSelector) return

	setFormValues(formSelector, formValue)

	formSelector.addEventListener('submit', (e) => {
		e.preventDefault()
		const formValues = getFormValues(formSelector)
		console.log(formValues)
	})
}

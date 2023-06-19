export function getTextContent(parentElement, queryParams, text) {
	if (!parentElement) return
	const textElement = parentElement.querySelector(queryParams)
	textElement.textContent = text
}

export function setFieldValues(formSelector, queryParams, value) {
	if (!formSelector) return
	const field = formSelector.querySelector(queryParams)
	field.value = value
}

export function setBackgroundImage(parentElement, queryParams, value) {
	if (!parentElement) return
	const targetElement = parentElement.querySelector(queryParams)
	targetElement.style.backgroundImage = `url(${value})`
}

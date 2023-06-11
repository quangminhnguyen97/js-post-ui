export function getTextContent(parentElement, queryParams, text) {
	if (!parentElement) return
	const textElement = parentElement.querySelector(queryParams)
	textElement.textContent = text
}

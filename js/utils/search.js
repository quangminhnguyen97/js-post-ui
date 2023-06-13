import debounce from 'lodash.debounce'
export function initSearch({ elementId, defaultParams, onChange }) {
	const searchInput = document.getElementById(elementId)
	if (!searchInput) return

	if (defaultParams.get('title_like')) {
		searchInput.value = defaultParams.get('title_like')
	}
	const searchText = debounce((event) => onChange(event.target.value), 500)
	searchInput.addEventListener('input', (event) => {
		searchText(event)
	})
}

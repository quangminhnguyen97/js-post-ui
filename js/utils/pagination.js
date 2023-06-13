export function initPagination({ elementId, defaultParams, onChange }) {
	const ulPagination = document.getElementById(elementId)
	if (!ulPagination) return

	const prevElm = ulPagination.firstElementChild?.firstElementChild
	if (prevElm) {
		prevElm.addEventListener('click', (e) => {
			e.preventDefault()
			const page = ulPagination.dataset.page || 1
			onChange(+page - 1)
		})
	}

	const nextElm = ulPagination.lastElementChild?.firstElementChild
	if (nextElm) {
		nextElm.addEventListener('click', (e) => {
			e.preventDefault()
			const page = ulPagination.dataset.page || 1
			onChange(+page + 1)
		})
	}
}

export function renderPagination(elementId, pagination) {
	const ulElement = document.getElementById(elementId)
	if (!pagination || !ulElement) return
	const { _page, _limit, _totalRows } = pagination
	const totalPages = Math.ceil(_totalRows / _limit)

	ulElement.dataset.page = _page
	ulElement.dataset.totalPages = totalPages

	if (_page <= 1) ulElement.firstElementChild.classList.add('disabled')
	else ulElement.firstElementChild.classList.remove('disabled')

	if (_page >= totalPages) ulElement.lastElementChild.classList.add('disabled')
	else ulElement.lastElementChild.classList.remove('disabled')
}

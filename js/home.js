import postApi from './api/postApi'
import { getPostPagination, getTextContent } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
function createPostItem(data) {
	const template = document.getElementById('postTemplate')
	if (!template) return
	const liElement = template.content.firstElementChild.cloneNode(true)

	getTextContent(liElement, "[data-id='title']", data.title)
	getTextContent(liElement, "[data-id='author']", data.author)
	getTextContent(liElement, "[data-id='description']", data.description)
	getTextContent(liElement, "[data-id='timeSpan']", `- ${dayjs(data.createdAt).fromNow()}`)

	const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')

	if (thumbnailElement) {
		thumbnailElement.src = data.imageUrl
		thumbnailElement.addEventListener('error', () => {
			thumbnailElement.src = 'https://placehold.co/1368x400?text=Haizza'
		})
	}

	return liElement
}

function renderPostList(postList) {
	if (!Array.isArray(postList) || postList.length === 0) return
	const ulElement = document.getElementById('postsList')
	if (!ulElement) return

	ulElement.textContent = ''

	postList.forEach((item, idx) => {
		const postItem = createPostItem(item)
		ulElement.appendChild(postItem)
	})
}

function renderPagination(pagination) {
	const ulElement = getPostPagination()
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

async function handleFilterChange(filterName, filterValue) {
	try {
		const url = new URL(window.location)
		url.searchParams.set(filterName, filterValue)
		history.pushState({}, '', url)

		console.log('url', url.searchParams)

		const { data, pagination } = await postApi.getAll(url.searchParams)
		renderPostList(data)
		renderPagination(pagination)
	} catch (error) {
		throw new Error('Fail to load pagination')
	}
}

function handlePrevClick(e) {
	e.preventDefault()
	const ulPagination = getPostPagination()
	const page = ulPagination.dataset.page || 1
	handleFilterChange('_page', +page - 1)
}

function handleNextClick(e) {
	e.preventDefault()
	const ulPagination = getPostPagination()
	const page = ulPagination.dataset.page || 1
	handleFilterChange('_page', +page + 1)
}

function initPagination() {
	const ul = getPostPagination()
	if (!ul) return

	const prevElm = ul.firstElementChild?.firstElementChild
	if (prevElm) prevElm.addEventListener('click', handlePrevClick)

	const nextElm = ul.lastElementChild?.firstElementChild
	if (nextElm) nextElm.addEventListener('click', handleNextClick)
}

function initQueryParams() {
	const url = new URL(window.location)
	if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
	if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
	history.pushState({}, '', url)
}

;(async () => {
	try {
		initPagination()
		initQueryParams()
		const queryParams = new URLSearchParams(window.location.search)
		const { data, pagination } = await postApi.getAll(queryParams)
		renderPostList(data)
		renderPagination(pagination)
	} catch (error) {
		console.log(error)
	}
})()

import postApi from './api/postApi'
import { getTextContent } from './utils'
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
	thumbnailElement.src = data.imageUrl

	return liElement
}

function renderPostList(postList) {
	if (!Array.isArray(postList) || postList.length === 0) return
	const ulElement = document.getElementById('postsList')
	if (!ulElement) return

	postList.forEach((item, idx) => {
		const postItem = createPostItem(item)
		ulElement.appendChild(postItem)
	})
}

;(async () => {
	const queryParams = {
		_page: 1,
		_limit: 6,
	}
	const response = await postApi.getAll(queryParams)
	const { data, pagination } = response

	renderPostList(data)
	try {
	} catch (error) {
		console.log(error)
	}
})()

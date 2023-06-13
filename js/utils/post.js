import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getTextContent } from './common'

dayjs.extend(relativeTime)
function createPostItem(data) {
	const template = document.getElementById('postTemplate')
	if (!template) returnO
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

export function renderPostList(elementId, postList) {
	if (!Array.isArray(postList)) return
	const ulElement = document.getElementById(elementId)
	if (!ulElement) return

	ulElement.textContent = ''

	postList.forEach((item, idx) => {
		const postItem = createPostItem(item)
		ulElement.appendChild(postItem)
	})
}

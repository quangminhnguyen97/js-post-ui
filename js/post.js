import dayjs from 'dayjs'
import postApi from './api/postApi'
import { getTextContent } from './utils'
import { registerLightbox } from './utils/lightbox'

function renderPostDetail(postData) {
	getTextContent(document, '#postDetailTitle', postData.title)
	getTextContent(document, '#postDetailAuthor', postData.author)
	getTextContent(document, '#postDetailTimeSpan', dayjs(postData.createdAt).format('- DD-MM-YYYY HH:mm'))
	getTextContent(document, '#postDetailDescription', postData.description)

	// background
	const backgroundElm = document.getElementById('postHeroImage')
	if (backgroundElm) {
		backgroundElm.style.backgroundImage = `url(${postData.imageUrl})`
		backgroundElm.addEventListener('error', () => {
			backgroundElm.src = 'https://placehold.co/1368x400?text=Haizza'
		})
	}
	// link to add-edit
	const addEditLink = document.getElementById('goToEditPageLink')
	if (addEditLink) {
		addEditLink.addEventListener('click', () => {
			window.location.assign(`add-edit-post.html?id=${postData.id}`)
		})
		addEditLink.innerHTML = '<i class="far fa-edit"></i> Edit Post'
		const iConElm = addEditLink.firstElementChild
		iConElm.style.transform = 'rotate(0deg)'
	}
}

;(async () => {
	registerLightbox({
		modalId: 'lightbox',
		imgSelector: 'lightboxImg',
		preButton: 'lightBoxPrev',
		nextButton: 'lightBoxNext',
	})

	registerLightbox({
		modalId: 'lightbox',
		imgSelector: 'lightboxImg',
		preButton: 'lightBoxPrev',
		nextButton: 'lightBoxNext',
	})

	try {
		const params = new URLSearchParams(window.location.search)
		const postId = params.get('id')
		const postDetailData = await postApi.getById(postId)
		if (!postDetailData) {
			console.log('Could not find post ID')
		}
		renderPostDetail(postDetailData)
	} catch (error) {
		throw new Error('Could not load API')
	}
})()

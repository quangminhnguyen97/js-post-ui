import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import postApi from './api/postApi'
import {
	initPagination,
	renderPagination,
	initSearch,
	renderPostList,
	toast,
	getRandomNumber,
} from './utils'
import MicroModal from 'micromodal'

dayjs.extend(relativeTime)

async function handleFilterChange(filterName, filterValue) {
	try {
		const url = new URL(window.location)
		if (filterName) url.searchParams.set(filterName, filterValue)

		if (filterName === 'title_like') {
			url.searchParams.set('_page', 1)
		}
		console.log('url.searchParams', url.searchParams.toString())
		history.pushState({}, '', url)
		const { data, pagination } = await postApi.getAll(url.searchParams)
		renderPostList('postsList', data)
		renderPagination('postsPagination', pagination)
	} catch (error) {
		throw new Error('Fail to load pagination')
	}
}

function showHideButton(yesBtn, noBtn, loadingElm, flag) {
	switch (flag) {
		case 'started':
			yesBtn.classList.add('hiding')
			noBtn.classList.add('hiding')
			loadingElm.classList.remove('hiding')
			break
		case 'ended':
			yesBtn.classList.remove('hiding')
			noBtn.classList.remove('hiding')
			loadingElm.classList.add('hiding')
			break
		default:
			break
	}
}

function showModal(data) {
	MicroModal.show('deleteConfirm')
	const yesBtn = document.getElementById('yesBtn')
	const noBtn = document.getElementById('noBtn')
	const loadingElm = document.getElementById('loading')
	yesBtn.addEventListener('click', async () => {
		showHideButton(yesBtn, noBtn, loadingElm, 'started')
		await postApi.deletePost(data.id)
		toast.success('Delete succesfully!!!')
		await handleFilterChange()
		MicroModal.close('deleteConfirm')
		showHideButton(yesBtn, noBtn, loadingElm, 'ended')
	})
	noBtn.addEventListener('click', () => {
		MicroModal.close('deleteConfirm')
	})
}

function attachDeleteEvents() {
	document.addEventListener('delete-post', async (event) => {
		const post = event.detail
		showModal(post)
	})
}

function initCarouselImg() {
	const imgList = document.querySelectorAll('[name="carousel-image"]')
	imgList.forEach((image) => {
		const newSrc = `https://picsum.photos/id/${getRandomNumber(1000)}/1378/300`
		image.src = newSrc
	})
}

;(async () => {
	try {
		const url = new URL(window.location)
		if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
		if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
		history.pushState({}, '', url)
		const queryParams = url.searchParams
		initSearch({
			elementId: 'searchInput',
			defaultParams: queryParams,
			onChange: (value) => handleFilterChange('title_like', value),
		})
		initPagination({
			elementId: 'postsPagination',
			defaultParams: queryParams,
			onChange: (page) => handleFilterChange('_page', page),
		})
		attachDeleteEvents()
		handleFilterChange()
		initCarouselImg()
		MicroModal.init({
			awaitCloseAnimation: true,
		})
	} catch (error) {
		console.log(error)
	}
})()

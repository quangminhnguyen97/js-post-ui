import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import postApi from './api/postApi'
import { initPagination, renderPagination, initSearch, renderPostList } from './utils'

dayjs.extend(relativeTime)

async function handleFilterChange(filterName, filterValue) {
	try {
		const url = new URL(window.location)
		url.searchParams.set(filterName, filterValue)

		if (filterName === 'title_like') {
			url.searchParams.set('_page', 1)
		}

		history.pushState({}, '', url)
		const { data, pagination } = await postApi.getAll(url.searchParams)
		renderPostList('postsList', data)
		renderPagination('postsPagination', pagination)
	} catch (error) {
		throw new Error('Fail to load pagination')
	}
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
		const { data, pagination } = await postApi.getAll(queryParams)
		renderPostList('postsList', data)
		renderPagination('postsPagination', pagination)
	} catch (error) {
		console.log(error)
	}
})()

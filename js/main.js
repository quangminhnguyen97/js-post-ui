import postApi from './api/postApi'

const main = async () => {
	const queryParams = {
		_page: 1,
		limit: 10,
	}
	const response = await postApi.getAll(queryParams)
	try {
	} catch (error) {}
}

const getPost = async () => {
	const res = await postApi.getById('lea11ziflg8xoixr1')
	try {
	} catch (error) {}
}

const createPost = async () => {
	const data = {
		title: 'minh test',
		author: 'minh test',
		description: 'minh test',
		imageUrl: 'https://picsum.photos/id/10/1378/400',
	}
	const res = await postApi.createPost(data)
	try {
	} catch (error) {}
}

createPost()
getPost()
main()

import axiosClient from './axiosClient'

const postApi = {
	getAll(params) {
		const url = '/posts'
		return axiosClient.get(url, { params })
	},

	getById(id) {
		const url = '/posts'
		return axiosClient.get(`${url}/${id}`)
	},

	// createPost(data) {
	// 	const url = '/posts'
	// 	return axiosClient.post(url, data)
	// },

	// updatePost(data) {
	// 	const url = `/posts/${data.id}`
	// 	return axiosClient.patch(url, data)
	// },

	createPostForm(data) {
		const url = '/with-thumbnail/posts'
		return axiosClient.post(url, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	},

	updatePostForm(data) {
		const url = `/with-thumbnail/posts/${data.get('id')}`
		return axiosClient.patch(url, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	},

	deletePost(id) {
		const url = '/posts'
		return axiosClient.delete(`${url}/${id}`)
	},
}

export default postApi

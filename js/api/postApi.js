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

	createPost(data) {
		const url = '/posts'
		return axiosClient.post(url, { data })
	},

	updatePost(data) {
		const url = '/posts'
		return axiosClient.patch(url, data)
	},

	deletePost(id) {
		const url = '/posts'
		return axiosClient.delete(`${url}/${id}`)
	},
}

export default postApi

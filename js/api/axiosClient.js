import axios from 'axios'

const axiosClient = axios.create({
	baseURL: 'https://js-post-api.herokuapp.com/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

axiosClient.interceptors.request.use(
	function (config) {
		const accessToken = localStorage.getItem('access_token')
		if (accessToken) {
			config.accessToken = `Bearer ${accessToken}`
		}
		return config
	},
	function (error) {
		return Promise.reject(error)
	}
)

axiosClient.interceptors.response.use(
	function (response) {
		return response.data
	},
	function (error) {
		if (!error.response) throw new Error('Network error. Please try again')
		return Promise.reject(error)
	}
)

export default axiosClient

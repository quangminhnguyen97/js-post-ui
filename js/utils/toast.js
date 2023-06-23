import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
	info(message) {
		Toastify({
			text: message,
			duration: 3000,
			close: true,
			gravity: 'top',
			position: 'right',
			style: {
				background: '#ffeb3b',
			},
		}).showToast()
	},
	success(message) {
		Toastify({
			text: message,
			duration: 3000,
			close: true,
			gravity: 'top',
			position: 'right',
			style: {
				background: '#4caf50',
			},
		}).showToast()
	},
	error(message) {
		Toastify({
			text: message,
			duration: 3000,
			close: true,
			gravity: 'top',
			position: 'right',
			style: {
				background: '#ff1744',
			},
		}).showToast()
	},
}

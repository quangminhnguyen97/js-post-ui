import postApi from './api/postApi'
import { form } from './utils'
;(async () => {
	try {
		const searchParams = new URLSearchParams(window.location.search)
		const postId = searchParams.get('id')
		const defaultValues = postId
			? await postApi.getById(postId)
			: {
					title: '',
					author: '',
					description: '',
					imageUrl: '',
			  }

		form({
			formId: 'postForm',
			formValue: defaultValues,
			onSubmit: (values) => console.log('Submit', values),
		})
	} catch (error) {
		console.log('Error add edit form', error)
	}
})()

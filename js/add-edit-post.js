import postApi from './api/postApi'
import { form, toast } from './utils'

async function handleSubmitForm(formValues) {
	try {
		const postSaved = formValues.id ? await postApi.updatePost(formValues) : await postApi.createPost(formValues)

		toast.success('Saved post successfully ^^')

		setTimeout(() => {
			window.location.assign(`post-detail.html?id=${postSaved.id}`)
		}, 2000)
	} catch (error) {
		toast.error(`Error: ${error}`)
	}
}

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
			onSubmit: (values) => handleSubmitForm(values),
		})
	} catch (error) {
		console.log('Error add edit form', error)
	}
})()

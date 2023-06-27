import postApi from './api/postApi'
import { form, toast } from './utils'

function removeUnnecessaryFields(formValues) {
	const payload = { ...formValues }
	if (payload.imageSource === 'picsum') {
		delete payload.image
	} else {
		delete payload.imageUrl
	}
	delete payload.imageSource
	if (!payload.id) delete payload.id
	return payload
}

function jsonToObject(jsonObj) {
	const form = new FormData()
	for (const key in jsonObj) {
		form.set(key, jsonObj[key])
	}
	return form
}

async function handleSubmitForm(formValues) {
	try {
		const payload = removeUnnecessaryFields(formValues)
		const formData = jsonToObject(payload)
		const postSaved = formValues.id
			? await postApi.updatePostForm(formData)
			: await postApi.createPostForm(formData)

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
		toast.error(`Error: ${error}`)
	}
})()

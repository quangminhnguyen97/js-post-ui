function showModal(modal) {
	if (!modal) return
	let myModal = new bootstrap.Modal(modal)
	myModal.show()
}

export function registerLightbox({ modalId, imgSelector, preButton, nextButton }) {
	const modalSelector = document.getElementById(modalId)

	let imgList = []
	let currentIdx = 0

	if (modalSelector.dataset.registered) return

	const preBtn = document.getElementById(preButton)
	const nextBtn = document.getElementById(nextButton)

	function attachImage(currentIdx) {
		const image = document.getElementById(imgSelector)
		image.src = imgList[currentIdx].src
	}

	document.addEventListener('click', (e) => {
		const { target } = e
		if (target.tagName !== 'IMG' || !target.dataset.album) return

		imgList = document.querySelectorAll(`[data-album="${target.dataset.album}"]`)

		currentIdx = [...imgList].findIndex((i) => i === target)
		attachImage(currentIdx)
		showModal(modalSelector)
	})

	preBtn.addEventListener('click', () => {
		currentIdx = (currentIdx + imgList.length - 1) % imgList.length
		attachImage(currentIdx)
	})

	nextBtn.addEventListener('click', () => {
		currentIdx = (currentIdx + 1) % imgList.length
		attachImage(currentIdx)
	})

	modalSelector.dataset.registered = true
}

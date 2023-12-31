const apiUrl =
	'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-ACC-PT-WEB-PT-A/events'

const mainDiv = document.querySelector('#main-content')

init()

async function init() {
	try {
		const response = await fetch(apiUrl)
		const data = await response.json()
		console.log(data)
		data.data.forEach((event) => {
			renderData(event)
		})
	} catch (error) {
		console.log(error)
	}
}

const renderData = (data) => {
	const card = document.createElement('li')
	card.classList.add('relative', 'bg-gray-800', 'rounded-2xl')
	card.id = data.id
	card.dataset.cohortId = data.cohortId
	card.innerHTML = `
                        <div class="absolute p-2 text-sm text-white bg-red-300 rounded-lg hover:bg-red-500 right-2 top-2" id="delete-event" onclick="">
                           <button type="button" onclick="deleteEvent(${
															data.id
														})">
                            Delete Event
                           </button>
                        </div>
                        <img
							class="object-cover w-full mx-auto h-96 rounded-2xl"
							src="https://www.eventcombo.com/Images/ECImages/3414eb64-1a48-415a-915d-4823abc68fca.jpg"
							alt="" />
						<div
							class="absolute bottom-0 w-full p-2 rounded-b-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500">
							<h3
								class="relative text-xl font-bold leading-7 tracking-tight text-white">
								${data.name}
							</h3>
							<p
								class="relative hover:whitespace-normal mt-2 transition-all  duration-200 overflow-hidden text-base italic font-light leading-7 tracking-tight text-white whitespace-nowrap text-ellipsis ">
								${data.description}
							</p>
                            <hr class="h-px my-8 bg-gray-200 border-0">
							<p class="mt-2 text-sm leading-6 text-white">
								<i class="mr-2 fa-solid fa-calendar-days"> </i> ${formatDate(data.date)}
							</p>
							<p class="text-sm leading-6 text-white">
								<i class="mr-2 fa-solid fa-location-dot"> </i> ${data.location}
							</p>
						</div>
            `

	mainDiv.appendChild(card)
}
// Function to format date
const formatDate = (date) => {
	const d = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'full',
		timeStyle: 'short',
	}).format(new Date(date))
	return d
}

//Delete Event

window.deleteEvent = async (id) => {
	const response = await fetch(`${apiUrl}/${id}`, {
		method: 'DELETE',
	})
	console.log(response)
	// delete the card from the DOM after the fetch request is successful (status code 204)
	if (response.status === 204) {
		const card = document.getElementById(id)
		card.classList.add('animate_fadeOut')
		setTimeout(() => {
			card.remove()
		}, 1000)
	} else {
		alert('Something went wrong!')
	}
}

// Event Submission Form modal

const dialog = document.querySelector('#createEventFormModal')
const openModalButton = document.querySelector('#openModalButton')
const submitButton = document.querySelector('#submitButton')

openModalButton.addEventListener('click', () => {
	dialog.showModal()
})

submitButton.addEventListener('click', () => {
	createEvent()
})

// Create Event
const createEvent = async () => {
	let name = document.querySelector('#name').value
	let description = document.querySelector('#description').value
	let date = document.querySelector('#dateTimePicker').value
	let location = document.querySelector('#location').value
	date = new Date(date).toISOString()

	const newEvent = {
		name,
		description,
		date,
		location,
	}
	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newEvent),
		})
		const data = await response.json()
		console.log(data)
		dialog.close()
		renderData(data.data)
	} catch (error) {
		console.log(error)
	}
}

async function deleteAllEvents() {
	try {
		const response = await fetch(apiUrl)
		const data = await response.json()
		console.log(data)
		data.data.forEach((event) => {
			deleteEvent(event.id)
		})
	} catch (error) {
		console.log(error)
	}
}

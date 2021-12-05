const wpmText = document.getElementById('wpm')
const timerText = document.getElementById('time')
const errorText = document.getElementById('errors')
const textArea = document.getElementById('textarea')
const typeText = document.getElementById('type-text')
const accuracyText = document.getElementById('accuracy')

let errors = 0
let accuracy = 0
let timeLeft = 0
let timeElapsed = 0
let typedCharacter = 0
let timer = null
let hasStarted = false
let TEXT
let TIME_LIMIT

document.addEventListener('DOMContentLoaded', () => {
	try {
		fetch('https://type.fit/api/quotes')
			.then((response) => response.ok && response.json())
			.then((response) => {
				const random = Math.trunc(Math.random() * 1643)
				TEXT = response[random].text
				TIME_LIMIT = Math.trunc(TEXT.length * 0.5)
				initializeTest({ timeLimit: TIME_LIMIT, text: TEXT })
				textArea.addEventListener('input', update)
			})
	} catch (err) {
		console.log(err)
	}
})

function initializeTest({ timeLimit, text }) {
	timerText.innerHTML = timeLimit
	text.split('').forEach((character) => (typeText.innerHTML += `<span>${character}</span>`))
}

function update() {
	if (!hasStarted) {
		timer = setInterval(updateTimer, 1000)
		hasStarted = true
	}
	typedCharacter++
	maxCharacter()
	updateCharactersStatus()
	updateErrors()
	updateAccuracy()
}

function maxCharacter() {
	const { length } = TEXT
	textArea.setAttribute('maxLength', length)
}

function updateCharactersStatus() {
	const character = [...textArea.value]
	let index = 0
	for (const span of typeText.children) {
		if (!character[index]) {
			span.className = ''
		} else if (span.innerHTML === character[index]) {
			span.className = 'correct-char'
		} else {
			span.className = 'incorrect-char'
		}
		++index
	}
}

function updateAccuracy() {
	accuracyText.innerHTML = Math.round(((typedCharacter - errors) / typedCharacter) * 100)
}

function updateErrors() {
	errors = typeText.querySelectorAll('.incorrect-char').length
	errorText.innerHTML = errors
}

function updateWpm() {
	wpmText.innerHTML = Math.round((typedCharacter / 5 / timeElapsed) * 60)
}

function updateTimer() {
	timeLeft = TIME_LIMIT - timeElapsed
	timerText.innerHTML = timeLeft
	if (TIME_LIMIT == timeElapsed) {
		finishTest()
	}
	if (timeElapsed !== 0) {
		updateWpm()
	}
	updateErrors()
	timeElapsed += 1
}

function finishTest() {
	textArea.disabled = true
	clearInterval(timer)
}

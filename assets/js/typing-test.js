const TIME_LIMIT = 10
const TEXT ='سعی نکنید همه چیز را بدانید. شما ممکن است خیلی چیزها را دیده و انجام داده باشید، اما لزوما به این معنی نیست که شما می دانید بهترین است. سعی نکنید به مردم بگویید که چگونه می توانند کارها را به شیوه ای بهتر انجام دهند یا اینکه بهتر می توانند کاری انجام دهند.'

let wpmText = document.getElementById('wpm')
let timerText = document.getElementById('time')
let errorText = document.getElementById('errors')
let textArea = document.getElementById('textarea')
let typeText = document.getElementById('type-text')
let accuracyText = document.getElementById('accuracy')
let errors = 0
let accuracy = 0
let timeLeft = 0
let timeElapsed = 0
let typedCharacter = 0
let timer = null
let hasStarted = false

initializeTest({ timeLimit: TIME_LIMIT, text: TEXT })
textArea.addEventListener('input', update)

function initializeTest ({ timeLimit, text }) {
  timerText.innerHTML = timeLimit
  text.split('').forEach(character => typeText.innerHTML += `<span>${character}</span>`)
}

function update () {
  if (!hasStarted) {
    timer = setInterval(updateTimer, 1000)
    hasStarted = true
  }
  typedCharacter++
  updateCharactersStatus()
  updateErrors()
  updateAccuracy()
}
function updateCharactersStatus () {
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
  errors = typeText.querySelectorAll('.incorrect-char').length
  updateErrors()
}

function updateAccuracy () {
  accuracyText.innerHTML = Math.trunc(((typedCharacter - errors) / typedCharacter) * 100
  )
}

function updateErrors () {
  errorText.innerHTML = errors
}

function updateWpm () {
  wpmText.innerHTML = Math.trunc((typedCharacter / 5 / timeElapsed) * 60)
}

function updateTimer () {
  if (TIME_LIMIT === timeElapsed) {
    finishTest()
    return
  }else{
      timerText.innerHTML = TIME_LIMIT - timeElapsed
      timeElapsed += 1
      updateWpm()
  }
}

function finishTest () {
  textArea.disabled = true
  clearInterval(timer)
}

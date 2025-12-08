

let myScore = 0
let timeLeft = 15
let fishPosition = 0
let isPlaying = false
let gameStarted = false
let timer = null
let fishTimer = null
let hitsCount = 0
let missesCount = 0
let playerName = ''


const customCursor = document.getElementById('custom-cursor')
const startGameBtn = document.getElementById('start-game-btn')
const timeDisplay = document.getElementById('time-left')
const hitMissText = document.getElementById('hit-miss-text')
const playerDisplay = document.getElementById('player-display')

// skapa kvadrat array
const squares = []
for (let i = 1; i <= 9; i++) {
  squares.push(document.getElementById(i.toString()))
}

// ta bort fisk från all kvadrat
function removeFishFromAll() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.remove('fish')
  }
}

// sätta fisk i random kvadrat
function putFishInSquare() {
  if (isPlaying == false) {
    return
  }
  
  removeFishFromAll()
  const randomNumber = Math.floor(Math.random() * 9) + 1
  fishPosition = randomNumber
  squares[randomNumber - 1].classList.add('fish')
  
  fishTimer = setTimeout(function() {
    if (fishPosition != 0) {
      missesCount = missesCount + 1
      hitMissText.innerHTML = 'MISS!'
      hitMissText.className = 'miss'
      setTimeout(() => {
        hitMissText.className = ''
      }, 300)
    }
    removeFishFromAll()
    fishPosition = 0
  }, 1500)
}

function clickSquare(squareNumber) {
  if (isPlaying == false) {
    return
  }
  if (fishPosition == squareNumber) {
    myScore = myScore + 1
    hitsCount = hitsCount + 1
    hitMissText.innerHTML = 'HIT!'
    hitMissText.className = 'hit'
    setTimeout(() => {
      hitMissText.className = ''
    }, 300)
    clearTimeout(fishTimer)
    setTimeout(function() {
      putFishInSquare()
    }, 500)
  } else {
    hitMissText.innerHTML = 'MISS!'
    hitMissText.className = 'miss'
    setTimeout(() => {
      hitMissText.className = ''
    }, 300)
    missesCount = missesCount + 1
  }
}

// click listener på alla kvadrater
for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener('mousedown', function() {
    clickSquare(i + 1)
  })
}


function updateTimer() {
  timeLeft = timeLeft - 1
  timeDisplay.innerHTML = timeLeft
  
  if (timeLeft == 0) {
    clearInterval(timer)
    clearTimeout(fishTimer)
    isPlaying = false
    gameStarted = false
    removeFishFromAll()
    
    // Importera saveHighScore från score.js
    import('./score.js').then(module => {
      module.sparaHighScore(myScore, hitsCount, missesCount, playerName)
      showGameOver()
    })
  }
}


export function beginGame() {
  if (gameStarted == true) {
    return
  }
  
  isPlaying = true
  gameStarted = true
  myScore = 0
  hitsCount = 0
  missesCount = 0
  timeLeft = 15
  hitMissText.innerHTML = ''
  
  customCursor.style.display = 'block'
  putFishInSquare()
  
  timer = setInterval(updateTimer, 1000)
  
  const fishAppearTimer = setInterval(function() {
    if (isPlaying == true) {
      putFishInSquare()
    } else {
      clearInterval(fishAppearTimer)
    }
  }, 2000)
}

export function showGameOver() {
  customCursor.style.display = 'none'
  
  const totalAttempts = hitsCount + missesCount
  const percentage = totalAttempts > 0 ? ((hitsCount / totalAttempts) * 100).toFixed(2) : '0.00'
  
  
  hitMissText.innerHTML = 'Game Over! Score: ' + percentage + '% (' + hitsCount + '/' + totalAttempts + ' hits)'
  hitMissText.style.fontSize = '24px'
  
  // visa play again button
  const playAgainBtn = document.getElementById('play-again-btn')
  playAgainBtn.style.display = 'block'
}


export function stopGame() {
  if (isPlaying == true) {
    clearInterval(timer)
    clearTimeout(fishTimer)
    isPlaying = false
    gameStarted = false
    customCursor.style.display = 'none'
  }
}

// Sätta användar namnet
export function setPlayerName(name) {
  playerName = name
  playerDisplay.innerHTML = name
}


export function getPlayerName() {
  return playerName
}

// Reset game för att spela igen
export function resetGame() {
  gameStarted = false
  startGameBtn.style.display = 'block'
  const playAgainBtn = document.getElementById('play-again-btn')
  playAgainBtn.style.display = 'none'
  hitMissText.innerHTML = ''
  hitMissText.style.fontSize = '36px'
}

// sätta igång play again button
const playAgainBtn = document.getElementById('play-again-btn')
if (playAgainBtn) {
  playAgainBtn.addEventListener('click', function() {
    resetGame()
  })
}

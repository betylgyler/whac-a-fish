const profileSection = document.getElementById('profile')
const gameSection = document.getElementById('game-section')
const customCursor = document.getElementById('custom-cursor')
const startButton = document.getElementById('btn-start')
const playerNameInput = document.getElementById('player-name')
const playerDisplay = document.getElementById('player-display')
const startGameBtn = document.getElementById('start-game-btn')
const hamburgerIcon = document.getElementById('hamburger-icon')
const menuDropdown = document.getElementById('menu-dropdown')
const highScoreSection = document.getElementById('high-score-section')

// klickbar meny
hamburgerIcon.addEventListener('click', function() {
  if (menuDropdown.style.display == 'none' || menuDropdown.style.display == '') {
    menuDropdown.style.display = 'block'
  } else {
    menuDropdown.style.display = 'none'
  }
})

// När användare lämnar in sitt namn
const registrationForm = document.getElementById('registration-form')
registrationForm.addEventListener('submit', function(e) {
  e.preventDefault()
  
  playerName = playerNameInput.value.trim()
  if (playerName == '') {
    playerNameInput.style.borderColor = 'red'
    playerNameInput.placeholder = 'Name is required!'
    setTimeout(() => {
      playerNameInput.style.borderColor = ''
      playerNameInput.placeholder = 'Enter your name'
    }, 2000)
    return
  }
  
  // spara namnet så att vi inte tappar bort när vi refreshar
  localStorage.setItem('playerName', playerName)
  
  playerDisplay.innerHTML = playerName
  
  showSection('game-section')
  startGameBtn.style.display = 'block'
})

startGameBtn.addEventListener('click', function() {
  if (gameStarted == false) {
    startGameBtn.style.display = 'none'
    customCursor.style.display = 'block'
    beginGame()
  }
})

document.addEventListener('mousemove', function(e) {
  customCursor.style.left = e.pageX + 'px'
  customCursor.style.top = e.pageY + 'px'
})

const squares = []
for (let i = 1; i <= 9; i++) {
  squares.push(document.getElementById(i.toString()))
}

const timeDisplay = document.getElementById('time-left')
const hitMissText = document.getElementById('hit-miss-text')

let myScore = 0
let timeLeft = 15
let fishPosition = 0
let isPlaying = false
let gameStarted = false
let timer
let fishTimer
let hitsCount = 0
let missesCount = 0
let playerName = ''

// Single Page App 
const menuItems = [
  { id: 'profile', label: 'Register', section: 'profile' },
  { id: 'game', label: 'Game', section: 'game-section' },
  { id: 'high-score', label: 'High Score', section: 'high-score-section' }
]

function hideAllSections() {
  profileSection.classList.add('hidden')
  gameSection.classList.add('hidden')
  highScoreSection.classList.add('hidden')
}

// Säkertsälla att användaren registrerar före spelet
function showSection(sectionId) {
  if (sectionId === 'game-section' && !localStorage.getItem('playerName')) {
    sectionId = 'profile'
  }
  
  hideAllSections()
  hideAllSections()
  
  const section = document.getElementById(sectionId)
  if (section) {
    section.classList.remove('hidden')
    if (sectionId === 'game-section') {
      section.style.display = 'flex'
    } else {
      section.style.display = 'block'
    }
  }
  
  customCursor.style.display = 'none'
}

// bygga menyn knappar
function createMenu() {
  const navElement = document.querySelector('nav')
  if (!navElement) return
  
  navElement.innerHTML = ''
  
  menuItems.forEach(function(item) {
    const button = document.createElement('button')
    button.textContent = item.label
    button.id = 'menu-' + item.id
    button.classList.add('nav-button')
    
    button.addEventListener('click', function() {
      handleMenuClick(item.section)
    })
    
    // Placera button på nav section
    navElement.appendChild(button)
  })
}

function handleMenuClick(sectionId) {
  menuDropdown.style.display = 'none'
  if (isPlaying == true) {
    clearInterval(timer)
    clearTimeout(fishTimer)
    isPlaying = false
    gameStarted = false
  }
  
  if (sectionId === 'player-profile-section' && playerName === '') {
    sectionId = 'game-section'
  }
  
  if (sectionId === 'high-score-section') {
    loadHighScores()
  }
  
  showSection(sectionId)
}

// kolla om användaren har registrerat
window.addEventListener('load', function() {
  createMenu()
  
  const savedName = localStorage.getItem('playerName')
  if (savedName != null && savedName != '') {
    playerName = savedName
    playerDisplay.innerHTML = playerName
    showSection('game-section')
    startGameBtn.style.display = 'block'
  } else {
    showSection('profile')
  }
})

function removeFishFromAll() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.remove('fish')
  }
}

function putFishInSquare() {
  removeFishFromAll()
  
  let randomNumber = Math.random()
  randomNumber = randomNumber * 9
  randomNumber = Math.floor(randomNumber)
  randomNumber = randomNumber + 1
  
  fishPosition = randomNumber
  
  // addera random fiskar
  squares[randomNumber - 1].classList.add('fish')
  
  // gömma fiskar efter 1.5 sekunder
  fishTimer = setTimeout(function() {
    if (fishPosition != 0 && isPlaying) {
      hitMissText.innerHTML = 'MISS!'
      hitMissText.className = 'miss'
      missesCount = missesCount + 1
      setTimeout(() => {
        if (isPlaying && hitMissText.className !== 'gameover') {
          hitMissText.innerHTML = ''
          hitMissText.className = ''
        }
      }, 500)
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
      if (hitMissText.className !== 'gameover') {
        hitMissText.className = ''
        hitMissText.innerHTML = ''
      }
    }, 500)
    clearTimeout(fishTimer)
    setTimeout(function() {
      putFishInSquare()
    }, 500)
  } else {
    hitMissText.innerHTML = 'MISS!'
    missesCount = missesCount + 1
    hitMissText.className = 'miss'
    setTimeout(() => { 
      if (hitMissText.className !== 'gameover') {
        hitMissText.className = ''
        hitMissText.innerHTML = ''
      }
    }, 500)
  }
}

// gör varje kvadrat klickbar
for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener('mousedown', function() {
    clickSquare(i + 1)
  })
}

function saveHighScore(score) {
  let oldScores = localStorage.getItem('gameScores')
  if (oldScores == null) {
    oldScores = '[]'
  }
  
  const scoresArray = JSON.parse(oldScores)
  
  const totalAttempts = hitsCount + missesCount
  let percentage = 0
  if (totalAttempts > 0) {
    percentage = (hitsCount / totalAttempts) * 100
    percentage = percentage.toFixed(2)
  }
  
  const today = new Date()
  const dateString = today.toLocaleDateString()
  const timeString = today.toLocaleTimeString()
  
  let currentPlayerName = playerName
  if (currentPlayerName == '') {
    currentPlayerName = 'Anonymous'
  }
  
  const newScore = {
    score: percentage,
    date: dateString,
    time: timeString,
    name: currentPlayerName
  }
  
 
  scoresArray.push(newScore)
  localStorage.setItem('gameScores', JSON.stringify(scoresArray))
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
    saveHighScore(myScore)
    showGameOver()
  }
}

function beginGame() {
  if (isPlaying == true) {
    return
  }
  
  isPlaying = true
  gameStarted = true
  myScore = 0
  hitsCount = 0
  missesCount = 0
  timeLeft = 15
  timeDisplay.innerHTML = timeLeft
  hitMissText.innerHTML = ''
  hitMissText.style.fontSize = '36px'
  
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

function showGameOver() {
  customCursor.style.display = 'none'
  isPlaying = false
  
  const totalAttempts = hitsCount + missesCount
  let percentage = 0
  if (totalAttempts > 0) {
    percentage = (hitsCount / totalAttempts) * 100
    percentage = percentage.toFixed(2)
  }
  
  hitMissText.innerHTML = 'Game Over! Score: ' + percentage + '% (' + hitsCount + '/' + totalAttempts + ' hits)'
  hitMissText.style.fontSize = '24px'
  hitMissText.className = 'gameover'
  
  const playAgainBtn = document.getElementById('play-again-btn')
  playAgainBtn.style.display = 'block'
}

const playAgainButton = document.getElementById('play-again-btn')
playAgainButton.addEventListener('click', function() {
  // göm play again button och visa start game button
  playAgainButton.style.display = 'none'
  startGameBtn.style.display = 'block'
  gameStarted = false
  hitMissText.innerHTML = ''
  hitMissText.style.fontSize = '36px'
})

function listHighScore() {
  let oldScores = localStorage.getItem('gameScores')
  if (oldScores == null) {
    oldScores = '[]'
  }
  
  const scoresArray = JSON.parse(oldScores)
  const historyDiv = document.getElementById('history-list')
  historyDiv.innerHTML = ''
  
  if (scoresArray.length == 0) {
    historyDiv.innerHTML = '<p>No previous games yet.</p>'
  } else {
    const sortedScores = scoresArray.sort(function(a, b) {
      return b.score - a.score
    })
    
    // Generera high score list på html
    let tableHTML = '<table><thead><tr><th>Rank</th><th>Score</th><th>Name</th><th>Date</th></tr></thead><tbody>'
    let k = 0
    while (k < sortedScores.length) {
      const rank = k + 1
      let playerNameDisplay = sortedScores[k].name
      if (playerNameDisplay == null || playerNameDisplay == '') {
        playerNameDisplay = 'Anonymous'
      }
      // ha det på %
      const scoreDisplay = sortedScores[k].score + '%'
      tableHTML = tableHTML + '<tr><td>' + rank + '</td><td>' + scoreDisplay + '</td><td>' + playerNameDisplay + '</td><td>' + sortedScores[k].date + '</td></tr>'
      k = k + 1
    }
    tableHTML = tableHTML + '</tbody></table>'
    historyDiv.innerHTML = tableHTML
  }
}

function loadHighScores() {
  listHighScore()
}


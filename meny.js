

const profileSection = document.getElementById('profile')
const gameSection = document.getElementById('game-section')
const highScoreSection = document.getElementById('high-score-section')
const hamburgerIcon = document.getElementById('hamburger-icon')
const menuDropdown = document.getElementById('menu-dropdown')
const startGameBtn = document.getElementById('start-game-btn')


const menuItems = [
  { id: 'profile', label: 'Register', section: 'profile' },
  { id: 'game', label: 'Game', section: 'game-section' },
  { id: 'high-score', label: 'High Score', section: 'high-score-section' }
]


hamburgerIcon.addEventListener('click', function() {
  const isHidden = menuDropdown.style.display == 'none' || menuDropdown.style.display == ''
  menuDropdown.style.display = isHidden ? 'block' : 'none'
})


function hideAllSections() {
  profileSection.classList.add('hidden')
  gameSection.classList.add('hidden')
  highScoreSection.classList.add('hidden')
}


export function showSection(sectionId) {
 
  if (sectionId === 'game-section' && !localStorage.getItem('playerName')) {
    sectionId = 'profile'
  }
  
  hideAllSections()
  
  const customCursor = document.getElementById('custom-cursor')
  customCursor.style.display = 'none'
  
 
  if (sectionId === 'profile') {
    profileSection.classList.remove('hidden')
    profileSection.style.display = 'flex'
  } else if (sectionId === 'game-section') {
    gameSection.classList.remove('hidden')
    gameSection.style.display = 'flex'
  } else if (sectionId === 'high-score-section') {
    highScoreSection.classList.remove('hidden')
    highScoreSection.style.display = 'block'
  }
}


export function createMenu() {
  const nav = document.querySelector('nav')
  nav.innerHTML = ''
  
  menuItems.forEach(function(item) {
    const button = document.createElement('button')
    button.id = item.id + '-btn'
    button.className = 'nav-button'
    button.textContent = item.label
    
    button.addEventListener('click', function() {
      handleMenuClick(item.section)
    })
    
    nav.appendChild(button)
  })
}

function handleMenuClick(sectionId) {
  menuDropdown.style.display = 'none'
  

  import('./game.js').then(module => {
    module.stopGame()
  })
  
 
  if (sectionId === 'high-score-section') {
    import('./score.js').then(module => {
      module.loadHighScores()
    })
  }
  
  showSection(sectionId)
}

export function initializeMenu() {
  createMenu()
  
  const savedName = localStorage.getItem('playerName')
  if (savedName) {
    import('./game.js').then(module => {
      module.setPlayerName(savedName)
    })
    showSection('game-section')
  } else {
    showSection('profile')
  }
}

// Play again button
const playAgainButton = document.getElementById('play-again-btn')
playAgainButton.addEventListener('click', function() {
  showSection('game-section')
  startGameBtn.style.display = 'block'
  import('./game.js').then(module => {
    module.resetGame()
  })
})

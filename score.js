
export function sparaHighScore(score, hitsCount, missesCount, användarNamn) {
  
  let oldScores = localStorage.getItem('gameScores')
  if (oldScores == null) {
    oldScores = '[]'
  }
  
  
  const scoresArray = JSON.parse(oldScores)
  
  // beräkna % 
  const totalAttempts = hitsCount + missesCount
  const percentage = totalAttempts > 0 ? ((hitsCount / totalAttempts) * 100).toFixed(2) : '0.00'
  
  // skapa ny score objekt med %
  const newScore = {
    score: parseFloat(percentage),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    name: användarNamn || 'Anonymous'
  }
  
 
  scoresArray.push(newScore)
  
  
  localStorage.setItem('gameScores', JSON.stringify(scoresArray))
}

// Lista ut high scores
export function listHighScore() {
  const historyDiv = document.getElementById('history-list')
  let oldScores = localStorage.getItem('gameScores')
  
  if (oldScores == null || oldScores == '[]') {
    historyDiv.innerHTML = '<p>No previous games yet. Be the first to play!</p>'
    return
  }
  
  const scoresArray = JSON.parse(oldScores)
  
  // Sortera scores i ordning
  const sortedScores = scoresArray.sort((a, b) => b.score - a.score)
  
 
  let htmlString = '<table><thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Date</th><th>Time</th></tr></thead><tbody>'
  
  let k = 0
  while (k < sortedScores.length) {
    const rank = k + 1
    const name = sortedScores[k].name || 'Anonymous'
    const score = sortedScores[k].score + '%'
    const date = sortedScores[k].date
    const time = sortedScores[k].time
    
    htmlString += '<tr>'
    htmlString += '<td>' + rank + '</td>'
    htmlString += '<td>' + name + '</td>'
    htmlString += '<td>' + score + '</td>'
    htmlString += '<td>' + date + '</td>'
    htmlString += '<td>' + time + '</td>'
    htmlString += '</tr>'
    
    k = k + 1
  }
  
  htmlString += '</tbody></table>'
  historyDiv.innerHTML = htmlString
}

// Laddad high scores 
export function loadHighScores() {
  listHighScore()
}

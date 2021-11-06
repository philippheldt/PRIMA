let playerName = document.getElementById('player-name');
let player1 = document.getElementById('player-1');
document.addEventListener('keyup', () => player1.innerHTML = playerName.value);

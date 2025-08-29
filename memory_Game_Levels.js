window.addEventListener("load", main);

const emojis = {
	 1: [ '🐶', '🐷' ],
	 2: [ '🐶', '🐷', '🐸', '🐹' ],
	 3: [ '🐶', '🐷', '🐸', '🐹', '🐺', '🐻', '🐼', '🐭' ],
	 4: [ '🐶', '🐷', '🐸', '🐹', '🐺', '🐻', '🐼', '🐭', '🐮', '🐯', '🐰', '🐱' ],
	}
let game = false;
let flippedCard = [];
let openCard = [];

let level = 1;
let score = 0;
let scoreLevel = 0;
let scoreAll = 0;
let scoreAllLevel = { 1: 0, 2: 0, 3: 0, 4: 0 };

function main() {
	createCards();
	updateScore();

	const startButton = document.getElementById("startButton");
	startButton.onclick = () => {
		playAgain(startButton);
	}
}

function playAgain(startButton) {
	if (document.getElementById('win-div')) {
		document.getElementById('win-div').remove();
	}

	flippedCard = [];
	openCard = [];
	level = 1;
	score = 0;
	scoreLevel = 0;
	updateScore();
	const gameBoard = document.getElementById('memoryBoard');
	gameBoard.replaceChildren();
	createCards();
}

function updateScore() {
	scoreAll = localStorage.getItem('max_score_memory');
	scoreAllLevel = loadFromLocalStorange();
	document.querySelector('.Level').textContent = level;
	document.querySelector('.scoreLevel').textContent = scoreLevel;
	document.querySelector('.score').textContent = score;
	document.querySelector('.scoreAllLevel').textContent = scoreAllLevel[level];
	document.querySelector('.scoreAll').textContent = scoreAll;

}

function createCards() {
	let cardSimbols = [...emojis[level], ...emojis[level]];
	let count;
	switch (level) {
		case 1:  count = 2; break;
		case 2:  count = 4; break;
		case 3:  count = 4; break;
		case 4:  count = 6; break;
	}

	shaffleCards(cardSimbols);
	const gameBoard = document.getElementById('memoryBoard');
	gameBoard.style.gridTemplateColumns = `repeat(${count}, 60px`;
	cardSimbols.forEach((emoji, index) => {
		const card = document.createElement('div');
		card.classList.add('card');
		card.dataset.index = index + 1;
		card.dataset.emoji = emoji;
		card.textContent = emoji;
		card.addEventListener('click', flipCard);
		gameBoard.appendChild(card);
	})
}

function shaffleCards(cardSimbols) {
	for(let i = cardSimbols.length-1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[cardSimbols[i],cardSimbols[j]] = [cardSimbols[j],cardSimbols[i]];
	}
}

function flipCard() {
	if(flippedCard.length == 2 
	|| this.className == 'card flipped'
	|| this.className == 'card matched') { return }
	this.classList.add('flipped');
	flippedCard.push(this);
	if(flippedCard.length == 2) {
		score++;
		scoreLevel++;
		document.querySelector('.scoreLevel').textContent = scoreLevel;
		document.querySelector('.score').textContent = score;
		checkCard();
	}
}

function checkCard() {
	if (flippedCard[0].dataset.emoji == flippedCard[1].dataset.emoji) {
		matchedCard();
	} else {
		unflipCard();
	}
}

function matchedCard() {
	flippedCard.forEach(card => {
		card.classList.remove('flipped');
		card.classList.add('matched');
		card.removeEventListener('click', flipCard);
		openCard.push(card);
	})
	flippedCard = [];
	checkLevel();
	if(level == 4) { checkWin() }
}

function unflipCard() {
	setTimeout(() => {
		flippedCard.forEach(card => {
			card.classList.remove('flipped');
		})
		flippedCard = [];
	}, 1000)
}


function checkLevel() {
	if(level == 4) { return }
	if (openCard.length == emojis[level].length * 2) {
		if(scoreLevel < scoreAllLevel[level] || scoreAllLevel[level] == 0 ) { 
			scoreAllLevel[level] = scoreLevel;
			saveToLocalStorange();
			document.querySelector('.scoreAllLevel').textContent = `Level ${level}: ${scoreAllLevel[level]}`;		
		}
		level++;
		document.querySelector('.Level').textContent = level;

		createLevelUp();
		levelUp();
	}
}

function levelUp() {
	flippedCard = [];
	openCard = [];
	scoreLevel = 0;
	updateScore();
	const gameBoard = document.getElementById('memoryBoard');
	gameBoard.replaceChildren();
	createCards();
}

function checkWin() {
	if (openCard.length == emojis[4].length * 2) {
		if(score < scoreAll || scoreAll == undefined ) { 
			scoreAll = score;
			localStorage.setItem('max_score_memory', scoreAll);
			document.querySelector('.scoreAll').textContent = scoreAll;		
		}

		game = false;
		createWin();
	}
}

function createLevelUp() {
	const winDiv = document.createElement("div");
	winDiv.id = "level-up-div";
	winDiv.classList.add('winDiv')	

	const glitterEnd = document.createElement("div");
	glitterEnd.id = "glitterEnd";
	glitterEnd.textContent = String.fromCodePoint(0x2728);
	glitterEnd.style.fontSize = '250px';

	const glitterEndText = document.createElement("div");
	glitterEndText.id = "graveEndText";
	glitterEndText.textContent = 'level up';
	glitterEndText.style.fontSize = '150px';

	winDiv.appendChild(glitterEnd);
	winDiv.appendChild(glitterEndText);

	document.body.appendChild(winDiv);

	setTimeout(() => {
		document.getElementById('level-up-div').remove();
	}, 1000)
}

function createWin() {
	const winDiv = document.createElement("div");
	winDiv.id = "win-div";
	winDiv.classList.add('winDiv')	

	const glitterEnd = document.createElement("div");
	glitterEnd.id = "glitterEnd";
	glitterEnd.textContent = String.fromCodePoint(0x2728);
	glitterEnd.style.fontSize = '250px';

	const glitterEndText = document.createElement("div");
	glitterEndText.id = "graveEndText";
	glitterEndText.textContent = 'you win';
	glitterEndText.style.fontSize = '150px';

	winDiv.appendChild(glitterEnd);
	winDiv.appendChild(glitterEndText);

	document.body.appendChild(winDiv);
}

function loadFromLocalStorange() {
	let scoreAllLevel1 = localStorage.getItem('max_score_Level_memory');
	let scoreAllLevel2 = JSON.parse(scoreAllLevel1);
	if(scoreAllLevel2 !== null) { scoreAllLevel = scoreAllLevel2 }
	return scoreAllLevel
}

function saveToLocalStorange() {
	let scoreAllLevel1 = JSON.stringify(scoreAllLevel);
	localStorage.setItem(`max_score_Level_memory`, scoreAllLevel1);
}





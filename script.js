const popup = document.querySelector('.popup');
const container = document.querySelector('.container');
const endpopup = document.querySelector('.endpopup');
const roundno = document.querySelector(".roundno");
const computer = document.querySelector(".computer img");
const player = document.querySelector(".player img");
const computerPoints = document.querySelector(".computerPoints");
const playerPoints = document.querySelector(".playerPoints");
const options = document.querySelectorAll(".options button");
const reset = document.querySelector(".reset");
const instantres = document.querySelector('.instantres');
const finalres = document.querySelector('.finalres');
const form = document.querySelector("form");

function disableAlloptions() {
	for (let i = 0; i < options.length; i++) {
		options[i].disabled = true;
	}
}

function enableAlloptions() {
	for (let i = 0; i < options.length; i++) {
		options[i].disabled = false;
	}
}

window.addEventListener('load', () => {
	popup.classList.add('showPopup');
	popup.childNodes[1].classList.add('showPopup');
	container.style.filter = 'blur(25px)';
});

let rr = 0;

form.addEventListener("submit", (event) => {
	const data = new FormData(form);
	for (const entry of data) {
		rr = parseInt(entry[1]);
	}
	if (rr == 0) {
		alert("Please select an option");
		return;
	}
	event.preventDefault();
	popup.classList.remove('showPopup');
	popup.childNodes[1].classList.remove('showPopup');
	container.style.filter = 'none';
	displayScores();
});

function saveScore(player, computer) {
	console.log(player, computer);
	let rp = rr;
	rp = rr / 5 - 1;
	let scores = localStorage.getItem('rpsScore');
	let temp = [
		{
			game: 0,
			player: 0,
			computer: 0
		},
		{
			game: 1,
			player: 0,
			computer: 0
		},
		{
			game: 2,
			player: 0,
			computer: 0
		}
	];
	scores = scores ? JSON.parse(scores) : temp;

	if (player >= computer) {
		if (player > scores[rp].player) {
			scores[rp].player = player;
			scores[rp].computer = computer;
		} else if (player == scores[rp].player) {
			scores[rp].player = player;
			scores[rp].computer = Math.min(computer, scores[rp].computer);
		}
	}

	localStorage.setItem('rpsScore', JSON.stringify(scores));
}

function displayScores() {
	let scoresContainer = document.getElementById('BestScore');
	let idx = (rr / 5) - 1;

	let scores = localStorage.getItem('rpsScore');

	scores = scores ? JSON.parse(scores) : [];
	if (scores===[] && scores[idx]===undefined) {
		scoresContainer.innerHTML = `BestScore:<span class='computerScore'>0</span>/<span class="playerScore">0</span>`;
	} else {
		scoresContainer.innerHTML = `BestScore:
		<span class='computerScore'>${scores[idx].computer}</span>/
		<span class="playerScore">${scores[idx].player}</span>`;
	}
}

let round = 1;
let games = 0;

options.forEach((option) => {
	option.addEventListener("click", () => {
		computer.classList.add("shakeComputer");
		player.classList.add("shakePlayer");
		disableAlloptions();
		games++;
		setTimeout(() => {
			computer.classList.remove("shakeComputer");
			player.classList.remove("shakePlayer");


			player.src = "./images/" + option.innerHTML + "Player.png"

			const choice = ["STONE", "PAPER", "SCISSORS"];
			let arrayNo = Math.floor(Math.random() * 3);
			let computerChoice = choice[arrayNo];
			computer.src = "./images/" + computerChoice + "Computer.png";

			let cPoints = parseInt(computerPoints.innerHTML);
			let pPoints = parseInt(playerPoints.innerHTML);

			if (option.innerHTML === "STONE") {
				if (computerChoice === "PAPER") {
					computerPoints.innerHTML = cPoints + 1;
					instantres.innerHTML = "Computer Won";
				}
				else if (computerChoice === "SCISSORS") {
					playerPoints.innerHTML = pPoints + 1;
					instantres.innerHTML = "Player Won";
				}
				else {
					instantres.innerHTML = "Tie!!!";
				}
			} else if (option.innerHTML === "PAPER") {
				if (computerChoice === "SCISSORS") {
					computerPoints.innerHTML = cPoints + 1;
					instantres.innerHTML = "Computer Won";
				}
				else if (computerChoice === "STONE") {
					playerPoints.innerHTML = pPoints + 1;
					instantres.innerHTML = "Player Won";
				}
				else {
					instantres.innerHTML = "Tie!!!";
				}
			} else {
				if (computerChoice === "STONE") {
					computerPoints.innerHTML = cPoints + 1;
					instantres.innerHTML = "Computer Won";
				}
				else if (computerChoice === "PAPER") {
					playerPoints.innerHTML = pPoints + 1;
					instantres.innerHTML = "Player Won";
				}
				else {
					instantres.innerHTML = "Tie!!!";
				}
			}
			instantres.style.visibility = "visible";
		}, 850);

		setTimeout(() => {
			let cPoints = parseInt(computerPoints.innerHTML);
			let pPoints = parseInt(playerPoints.innerHTML);

			let win = "YOU WIN!!";
			let lose = "YOU LOST";
			let draw = "DRAW..."
			if (games == rr) {
				if (cPoints > pPoints) {
					finalres.innerHTML = lose;
					computerPoints.classList.add('.win');
					playerPoints.classList.add('.lose');
				}

				else if (cPoints < pPoints) {
					finalres.innerHTML = win;
					computerPoints.classList.add('.lose');
					playerPoints.classList.add('.win');
				}
				else finalres.innerHTML = draw;
			}
		}, 900)

		setTimeout(() => {
			enableAlloptions();
			if (games == rr) {
				let computer = parseInt(computerPoints.innerHTML);
				let player = parseInt(playerPoints.innerHTML);
				saveScore(player, computer);
				disableAlloptions();
				endpopup.classList.add('showPopup');
				endpopup.childNodes[1].classList.add('showPopup');
				container.style.filter = 'blur(25px)';
			}
			player.src = "./images/STONEPlayer.png";
			computer.src = "./images/STONEComputer.png";
			if (round < rr)
				round++;
			roundno.innerHTML = round;
			instantres.style.visibility = "hidden";
			reset.addEventListener("click", () => {
				location.reload();
			});
		}, 2000);
	});
});


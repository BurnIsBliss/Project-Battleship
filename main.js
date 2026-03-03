import { Ship, Gameboard, Player } from "./script.js";

const players = [];

// Start game
function startGame() {
	const canvasElement = document.querySelector(".canvas");
	function createDiv(text, childElement) {
		const newDiv = document.createElement("div");
		newDiv.innerHTML = `${text}`;
		childElement.appendChild(newDiv);
	}
	createDiv(
		"Hello, there! Welcome to the game of Battleship.",
		canvasElement,
	);
	createDiv(
		' <a href="https://w.wiki/J33f#Description" target="_blank" rel="noopener noreferrer">Here are the rules</a>, in case you didn\'t know or need a refresher.',
		canvasElement,
	);
	const buttonElement = document.createElement("button");
	buttonElement.innerHTML = "Start";
	buttonElement.setAttribute("class", "start");
	canvasElement.appendChild(buttonElement);
	buttonElement.addEventListener("click", () => {
		getPlayer();
		const dialogElement = document.querySelector("#inputName");
		canvasElement.remove();
		dialogElement.showModal();
	});
}
// Function to input the name
function getPlayer() {
	const submitButton = document.querySelector("#modalSubmit");
	let player1Name, player2Name;
	submitButton.addEventListener("click", getNames);
	function getNames() {
		player1Name = document.querySelector("#player1").value;
		if (!player1Name) {
			document.querySelector(".errorMessage").innerHTML =
				"The above field is required.";
		} else {
			player2Name = document.querySelector("#player2").value
				? document.querySelector("#player2").value
				: "Computer";
			sessionStorage.setItem("Player1", player1Name);
			sessionStorage.setItem("Player2", player2Name);
			const dialogElement = document.querySelector("#inputName");
			dialogElement.close();
			players.push(new Player(player1Name));
			players.push(new Player(player2Name));
		}
	}
}

function displayGameboard(gameboardArr) {
	const canvasElement = document.querySelector(".canvas");
	for (let i = 1; i <= 11; i += 1) {
		const divElement = document.createElement("div");
		divElement.setAttribute("class", `row ${i}`);
		for (let j = 1; j <= 11; j += 1) {
			const cell = document.createElement("div");
			cell.setAttribute(
				"class",
				`cell ${String(i) + "y"} ${String(j) + "x"}`,
			);
			if (i == 1 && j != 1) {
				const letters = "ABCDEFGHIJ";
				cell.innerHTML = letters[j - 2];
				cell.setAttribute("style", "background-color : green");
			} else if (j == 1 && i != 1) {
				cell.innerHTML = i - 1;
				cell.setAttribute("style", "background-color : indigo");
			}
			divElement.appendChild(cell);
		}
		canvasElement.appendChild(divElement);
	}
	// Need to display the player board so as to place their ships first
	// During the start of the game the players must be able to see their board with their ships and,
	// also the other players board with the hit maps
}

function checkGameStatus() {
	// This function checks where the player are at currently after doing a page refresh
	// Because after doing a page refresh, the user must not go back to the starting screen
}

(function () {
	// startGame();
	displayGameboard([]);
})();

function createGameBoard(values) {}

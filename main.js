import { Ship, Gameboard, Player } from "./script.js";

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
		player2Name = document.querySelector("#player2").value
			? document.querySelector("#player2").value
			: "Computer";
		sessionStorage.setItem("Player1", player1Name);
		sessionStorage.setItem("Player2", player2Name);
	}
}

(function () {
	startGame();
})();

function createGameBoard(values) {}

import { Ship, Gameboard, Player } from "./script.js";

const players = []; // To store the player1 and player2 objects
const shipCollection = {
	// Object with ship name and their corresponding length
	Carrier: 5,
	Battleship: 4,
	Destroyer: 3,
	Submarine: 3,
	"Patrol Boat": 2,
};
const ships = Object.keys(shipCollection); // List with only the ship names

// Start game
function startGame() {
	const canvasElement = document.querySelector(".canvas");
	// Helper function for div creation
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
// Function to input the names of the players
function getPlayer() {
	const submitButton = document.querySelector("#modalSubmit");
	let player1Name, player2Name;
	submitButton.addEventListener("click", getNames);
	// Helper function to get the names of the players
	function getNames() {
		player1Name = document.querySelector("#player1").value;
		if (!player1Name) {
			// If player 1 name is empty, show error
			document.querySelector(".errorMessage").innerHTML =
				"The above field is required.";
		} else {
			// If player 2 name is empty, set it as 'Computer'
			player2Name = document.querySelector("#player2").value
				? document.querySelector("#player2").value
				: "Computer";
			// Add both these values to session storage
			sessionStorage.setItem("Player1", player1Name);
			sessionStorage.setItem("Player2", player2Name);
			const dialogElement = document.querySelector("#inputName");
			dialogElement.close();
			players.push(new Player(player1Name));
			players.push(new Player(player2Name));

			// DOM manipulation for adding the ships (Could have been a standalone function!)
			const bodyElement = document.querySelector("body");
			const headingElement = document.createElement("h2");
			headingElement.textContent = `Player '${players[0].playerName}' place your ships by clicking the below button.`;
			bodyElement.appendChild(headingElement);
			const buttonElement = document.createElement("button");
			buttonElement.setAttribute("type", "button");
			let i = 0;
			buttonElement.textContent = `Place a ship`;
			bodyElement.appendChild(buttonElement);
			buttonElement.addEventListener("click", () => {
				placeShipOnBoard(
					players[0],
					ships[i],
					shipCollection[ships[i]],
				);
				buttonElement.textContent = `Place a ship`;
				i += 1;
				if (i == 5) {
					buttonElement.remove();
					// Place computer ships randomly
					if (players[1].playerName == "Computer") {
						for (let shipName in shipCollection)
							placeComputerShips(
								shipCollection[shipName],
								shipName,
							);
					}
				}
			});
			// Need to display the board before placing ships
			displayGameboards(players[0]);
		}
	}
}

// Function to display the gameboard of both players individually (if player2 == null) and together
function displayGameboards(player1, player2 = null) {
	const bodyElement = document.querySelector("body");
	const prevMainContainer = document.querySelectorAll(".mainContainer");
	if (prevMainContainer.length) prevMainContainer[0].remove();
	const mainContainer = document.createElement("div");
	const playerBoard1 = document.createElement("div");
	const playerBoard2 = document.createElement("div");
	playerBoard1.innerHTML = !player2
		? `${player1.playerName}'s Board`
		: "Your Board";
	mainContainer.setAttribute("class", "mainContainer");
	playerBoard1.setAttribute("class", "playerBoard1");
	mainContainer.appendChild(playerBoard1);
	bodyElement.appendChild(mainContainer);
	function displayGameboardHelper(arr, board, k = 0) {
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
				} else if (j >= 2 && i >= 2) {
					if (!k) cell.innerHTML = arr[i - 2][j - 2];
					else {
						if (arr[i - 2][j - 2] == 0 || arr[i - 2][j - 2] == 1)
							cell.innerHTML = "?";
						else if (arr[i - 2][j - 2] == 2) cell.innerHTML == "X";
						else cell.innerHTML == "H";
					}
				}
				divElement.appendChild(cell);
			}
			board.appendChild(divElement);
		}
	}
	displayGameboardHelper(player1.returnGameboard(), playerBoard1);
	if (player2) {
		playerBoard2.innerHTML = "Opponents board";
		playerBoard2.setAttribute("class", "playerBoard2");
		mainContainer.appendChild(playerBoard2);
		displayGameboardHelper(player2.returnGameboard(), playerBoard2, 1);
	}
}

function placeShipOnBoard(player, ship, len) {
	// make return text and a value
	const dialogElement = document.querySelector("#shipPlacement");
	dialogElement.showModal();
	const headingElement = document.querySelector("#shipPlacement .heading");
	headingElement.innerHTML = `Enter co-ordinates to place the '${ship}' having a length of '${len}'`;
	const shipSubmitButton = document.querySelector("#shipSubmit");
	shipSubmitButton.addEventListener("click", placeShipHelper);
	function placeShipHelper() {
		const regex = /[A-J][-]\d/;
		const shipValue = document.querySelector("#ship").value;
		const orientationValue = document.querySelector("#orientation").value;
		if (regex.test(shipValue)) {
			const result = player.gameBoard.placeShip(
				len,
				shipValue,
				ship,
				orientationValue,
			);
			if (result[1]) {
				const shipErrorMessage =
					document.querySelector("#shipErrorMessage");
				shipErrorMessage.innerHTML = "";
				const errorMessageElement = document.querySelector(
					"#shipPlacement .errorMessage",
				);
				errorMessageElement.innerHTML = "";
				document.querySelector("#ship").value = "";
				document.querySelector("#orientation").value = "";
				dialogElement.close();
				displayGameboards(player);
				shipSubmitButton.removeEventListener("click", placeShipHelper);
				if (ship == "Patrol Boat") {
					document.querySelector("h2").textContent =
						`Player '${players[0].playerName}' has placed all their ships successfully!!!`;
					document.querySelector(".mainContainer").remove();
					displayGameboards(players[1]);
				}
			} else {
				const shipErrorMessage =
					document.querySelector("#shipErrorMessage");
				shipErrorMessage.innerHTML = `Error!!! <br/>${result[0]}`;
			}
		} else {
			const errorMessageElement = document.querySelector(
				"#shipPlacement .errorMessage",
			);
			errorMessageElement.innerHTML = "Enter a valid co-ordinate!";
		}
	}
}

function placeComputerShips(len, ship) {
	const randomNumber1 = Math.floor(Math.random() * 10);
	const randomNumber2 = Math.floor(Math.random() * 10);
	const orientationValue = Math.floor(Math.random() * 2) ? "V" : "H";
	const alphabets = "ABCDEFGHIJ";
	const shipValue = `${alphabets[randomNumber1]}-${randomNumber2}`;
	const result = players[1].gameBoard.placeShip(
		len,
		shipValue,
		ship,
		orientationValue,
	);
	if (!result[1]) placeComputerShips(len, ship);
	else sessionStorage.setItem(ship, [shipValue, orientationValue]);
	return;
}

function checkGameStatus() {
	// This function checks where the player are at currently after doing a page refresh
	// Because after doing a page refresh, the user must not go back to the starting screen
}

(function () {
	startGame();
})();

function createGameBoard(values) {}

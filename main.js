import { Player } from "./script.js";

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

// Function to display the gameboard players, with the coordinates shown and hidden
function displayGameboards(player, l = 0) {
	const bodyElement = document.querySelector("body");
	const prevMainContainer = document.querySelectorAll(".mainContainer");
	if (prevMainContainer.length) prevMainContainer[0].remove();
	const mainContainer = document.createElement("div");
	const playerBoard1 = document.createElement("div");
	playerBoard1.innerHTML = `${player.playerName}'s Board`;
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
						else if (arr[i - 2][j - 2] == 2) {
							cell.innerHTML = "X";
							cell.setAttribute(
								"style",
								"background-color : yellow; color: black",
							);
						} else {
							cell.innerHTML = "H";
							cell.setAttribute(
								"style",
								"background-color : red",
							);
						}
					}
				}
				divElement.appendChild(cell);
			}
			board.appendChild(divElement);
		}
	}
	displayGameboardHelper(player.returnGameboard(), playerBoard1, l);
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
				// Adding the co-ordinates to session storage
				sessionStorage.setItem(ship + ` ${players[0].playerName}`, [
					shipValue,
					orientationValue,
				]);
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
					if (players[1].playerName == "Computer") {
						document.querySelector("h2").textContent =
							`Player '${players[0].playerName}' has placed all their ships successfully!!!`;
						document.querySelector(".mainContainer").remove();
						setTimeout(() => {
							displayGameboards(players[1], 1);
							addAttackFunctionality(players[1]);
							document.querySelector("h2").textContent =
								"The game starts now. ATTACK>>>>>>";
						}, 1500);
					} else if (player != players[1]) {
						document.querySelector("h2").innerHTML =
							`Player '${players[0].playerName}' has placed all their ships successfully!!! <br/> Player '${players[1].playerName}' place your ships now!`;
						document.querySelector(".mainContainer").remove();
						player2ShipPlacement();
					} else if (player == players[1]) {
						const bodyElement = document.querySelector("body");
						bodyElement.removeChild(bodyElement.lastChild);
						document.querySelector("h2").innerHTML =
							`Player '${players[1].playerName}' has successfully placed all their ships!`;
						setTimeout(() => {
							displayGameboards(players[1], 1);
							addAttackFunctionality(players[1]);
							document.querySelector("h2").textContent =
								"The game starts now. ATTACK>>>>>>";
						}, 1500);
					}
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
	else
		sessionStorage.setItem(ship + ` ${players[1].playerName}`, [
			shipValue,
			orientationValue,
		]);
	return;
}

function player2ShipPlacement() {
	const bodyElement = document.querySelector("body");
	const buttonElement = document.createElement("button");
	buttonElement.textContent = "Place a ship";
	bodyElement.appendChild(buttonElement);
	displayGameboards(players[1]);
	let i = 0;
	buttonElement.addEventListener("click", () => {
		placeShipOnBoard(players[1], ships[i], shipCollection[ships[i]]);
		i += 1;
		if (i == 5) buttonElement.remove();
	});
}

// Need to remove afterwards, as this function was used for populating player1 ships randomly for testing purposes
function placePlayer1Ships(len, ship) {
	const randomNumber1 = Math.floor(Math.random() * 10);
	const randomNumber2 = Math.floor(Math.random() * 10);
	const orientationValue = Math.floor(Math.random() * 2) ? "V" : "H";
	const alphabets = "ABCDEFGHIJ";
	const shipValue = `${alphabets[randomNumber1]}-${randomNumber2}`;
	const result = players[0].gameBoard.placeShip(
		len,
		shipValue,
		ship,
		orientationValue,
	);
	if (!result[1]) placePlayer1Ships(len, ship);
	else
		sessionStorage.setItem(ship + ` ${players[0].playerName}`, [
			shipValue,
			orientationValue,
		]);
	return;
}

// Function to add attacking capabilities for the tiles
function addAttackFunctionality(playerToBeAttacked) {
	const allCells = document.querySelectorAll(".playerBoard1 .cell");
	allCells.forEach((cell) => {
		cell.addEventListener("click", () => {
			const value = cell.getAttribute("class").substring(5).split(" ");
			value[0] = value[0].replace("y", "");
			value[1] = value[1].replace("x", "");
			if (!(Number(value[0]) == 1) && !(Number(value[1]) == 1)) {
				const x = Number(value[1]) - 2;
				const y = Number(value[0]) - 1;
				const alphabets = "ABCDEFGHIJ";
				const coordinate = alphabets[x] + "-" + String(y);
				const result =
					playerToBeAttacked.gameBoard.receiveAttack(coordinate);
				if (result[1]) {
					const h2Element = document.querySelector("h2");
					if (
						// For playing against each other - 1
						playerToBeAttacked == players[1] &&
						players[1].playerName != "Computer"
					) {
						h2Element.textContent =
							`Player ${players[0].playerName} has played and, ` +
							result[0] +
							" Next player's turn ->";
						document.querySelector(".mainContainer").remove();
						if (
							playerToBeAttacked.gameBoard.calculateRemainingShips() ==
							5
						) {
							h2Element.textContent = `${players[0].playerName} has won the game! CONGRATULATIONS!!!!!`;
							return;
						}
						setTimeout(() => {
							displayGameboards(players[0], 1);
							addAttackFunctionality(players[0]);
						}, 1500);
					} else if (
						// For playing against computer
						playerToBeAttacked == players[1] &&
						players[1].playerName == "Computer"
					) {
						h2Element.textContent =
							`Player ${players[0].playerName} has played and, ` +
							result[0];
						setTimeout(() => {
							const computerResult = randomComputerAttack();
							h2Element.textContent =
								`Player ${players[1].playerName} has played and, ` +
								`${computerResult[0]}` +
								" Next player's turn ->";
							document.querySelector(".mainContainer").remove();
							if (
								playerToBeAttacked.gameBoard.calculateRemainingShips() ==
								5
							) {
								h2Element.textContent = `${players[0].playerName} has won the game! CONGRATULATIONS!!!!!`;
								return;
							} else if (
								players[0].gameBoard.calculateRemainingShips() ==
								5
							) {
								h2Element.textContent = `${players[1].playerName} has won the game! CONGRATULATIONS!!!!!`;
								return;
							}
							setTimeout(() => {
								displayGameboards(players[1], 1);
								addAttackFunctionality(players[1]);
							}, 1500);
						}, 2500);
					} else {
						// For playing against each other - 2
						h2Element.textContent =
							`Player ${players[1].playerName} has played and, ` +
							result[0] +
							" Next player's turn ->";
						document.querySelector(".mainContainer").remove();
						if (
							playerToBeAttacked.gameBoard.calculateRemainingShips() ==
							5
						) {
							h2Element.textContent = `${players[1].playerName} has won the game! CONGRATULATIONS!!!!!`;
							return;
						}
						setTimeout(() => {
							displayGameboards(players[1], 1);
							addAttackFunctionality(players[1]);
						}, 1500);
					}
				} else {
					const h2Element = document.querySelector("h2");
					h2Element.textContent =
						result[0] + ", try a different co-ordinate.";
				}
			}
		});
	});
}

function randomComputerAttack() {
	const randomNumber1 = Math.floor(Math.random() * 10);
	const randomNumber2 = Math.floor(Math.random() * 10);
	const alphabets = "ABCDEFGHIJ";
	const randomCoordinate = `${alphabets[randomNumber1]}-${randomNumber2}`;
	const result = players[0].gameBoard.receiveAttack(randomCoordinate);
	let newResult = false;
	if (!result[1]) newResult = randomComputerAttack();
	if (newResult) return newResult;
	else return result;
}

(function () {
	startGame();
})();

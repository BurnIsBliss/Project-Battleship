class Ship {
	/* 
	Ship Specs (Name: Size):
	1. Carrier: 5
	2. Battleship: 4
	3. Destroyer: 3
	4. Submarine: 3
	5. Patrol Boat: 2
	*/
	constructor(length, coordinates, name) {
		this.shipLength = length;
		this.numberOfHits = 0;
		this.sunkValue = false;
		this.name = name;
		this.coordinates = coordinates;
	}

	hit() {
		this.numberOfHits += 1;
		this.isSunk();
	}

	isSunk() {
		if (this.shipLength === this.numberOfHits) this.sunkValue = true;
	}
}

class Gameboard {
	constructor() {
		this.board = this.createBoard();
		this.ships = {};
		this.sunkShips = [];
	}
	createBoard() {
		let gameBoardArray = [];
		// 0 - means empty, 1 - means occupied by ship, 2 - means hit, 3 - means hit a ship
		for (let i = 0; i < 10; i += 1) {
			const arr = new Array(10).fill(0);
			gameBoardArray[i] = arr;
		}
		return gameBoardArray;
	}
	receiveAttack(coordinate) {
		let value = this.transformCoordinates(coordinate);
		if (!value) {
			return [
				"Please enter the correct co-ordinates to launch an attack! The entered co-ordinates does not exist.",
				false,
			];
		} else value = [value[0] - 1, value[1] - 1];
		if (this.board[value[1]][value[0]] == 0) {
			// If the co-ordinate misses the ship, but hits a valid cell.
			this.board[value[1]][value[0]] = 2;
			return ["Hit successful, MISSED the ship though!", true];
		} else if (this.board[value[1]][value[0]] == 2) {
			// The co-ordinate has already been hit once.
			return [
				"This is an incorrect co-ordinate, as this cell has already been hit!",
				false,
			];
		} else if (this.board[value[1]][value[0]] == 3) {
			// The co-ordinate of a ship has already been hit.
			return [
				"This is an incorrect co-ordinate as a part of the ship was already hit!",
				false,
			];
		} else {
			let sunkStatus = false;
			let key,
				k = 0;
			// The co-ordinate of a ship is being hit for the first time.
			this.board[value[1]][value[0]] = 3;
			for (key in this.ships) {
				const shipCoordinates = this.ships[key].coordinates;
				for (let [x, y] of shipCoordinates) {
					if (x == value[1] && y == value[0]) {
						this.ships[key].hit();
						k = 1;
						break;
					}
				}
				if (k) break;
			}
			if (this.ships[key].sunkValue) {
				this.sunkShips.push(this.ships[key]);
				console.log(this.sunkShips);
				sunkStatus = true;
			}
			if (sunkStatus)
				return [`The ${this.ships[key].name} has now sunk!!!`, true];
			else return ["You've have hit a ship, Bravo!", true];
		}
		// How to keep track of ships that are attacked?
	}
	placeShip(length, coordinate, name, alignment = "") {
		const value = this.transformCoordinates(coordinate);
		if (value === false) {
			return ["Incorrect co-ordinates", value];
		}
		if (
			this.board[value[1] - 1][value[0] - 1] == 1 ||
			this.board[value[1] - 1][value[0] - 1] == 2 ||
			this.board[value[1] - 1][value[0] - 1] == 3
		) {
			return ["Unable to place ship, try another co-ordinate!", false];
			// DRY (Can optimize at the end of the project)
		} else {
			if (alignment.toLowerCase() == "v" || !alignment) {
				// For vertical ship placement
				let allCoordinates = [[value[1] - 1, value[0] - 1]];
				let k = 0;
				for (let i = 1; i < length; i += 1) {
					if (value[1] + i > 10) {
						// Checking if the co-ordinate goes out of bounds
						k = 1;
						break;
					} else if (
						this.board[value[1] - 1 + i][value[0] - 1] == 0
					) {
						allCoordinates.push([value[1] - 1 + i, value[0] - 1]);
					} else {
						k = 1;
						break;
					}
				}
				if (!k) {
					for (let [x, y] of allCoordinates) {
						this.board[x][y] = 1;
					}
					this.ships[name] = new Ship(length, allCoordinates, name);
					return ["Ship placed successfully", true];
				} else {
					return [
						"Could not add ship to the board as the required cells are already taken by other ships/out of bounds. Please try again with a different co-ordinate!",
						false,
					];
				}
			} else {
				// For horizontal ship placement
				let allCoordinates = [[value[1] - 1, value[0] - 1]];
				let k = 0;
				for (let i = 1; i < length; i += 1) {
					if (value[0] + i > 10) {
						// Checking if the co-ordinate goes out of bounds
						k = 1;
						break;
					} else if (
						this.board[value[1] - 1][value[0] - 1 + i] == 0
					) {
						allCoordinates.push([value[1] - 1, value[0] - 1 + i]);
					} else {
						k = 1;
						break;
					}
				}
				if (!k) {
					for (let [x, y] of allCoordinates) {
						this.board[x][y] = 1;
					}
					this.ships[name] = new Ship(length, allCoordinates, name);
					return ["Ship placed successfully", true];
				} else {
					return [
						"Could not add ship to the board as the required cells are already taken by other ships/out of bounds. Please try again with a different co-ordinate!",
						false,
					];
				}
			}
		}
	}
	calculateRemainingShips() {
		return this.sunkShips.length; // Number of ships that has sunk
	}
	// Helper function to change the co-ordinate from 'B-1' to '[2, 1]'.
	transformCoordinates(coordinate) {
		const splitString = coordinate.split("-");
		const keyValuePairs = {
			A: 1,
			B: 2,
			C: 3,
			D: 4,
			E: 5,
			F: 6,
			G: 7,
			H: 8,
			I: 9,
			J: 10,
		};
		if (Number(splitString[1]) > 10 || Number(splitString[1]) < 1)
			return false; // Check to see if the y-axis value is out side the board
		else if (keyValuePairs[splitString[0]] === undefined)
			// Is this a  right approach? Checking a value against 'undefined'?
			return false; // The x-axis value is not present in the keyValuePairs object
		else return [keyValuePairs[splitString[0]], Number(splitString[1])];
	}
	// Get sunk skip name and count
	getSunkShips() {
		if (this.sunkShips.length) {
			return true;
		} else return false;
	}

	getGameboard() {
		return this.board;
	}
}

class Player {
	constructor(playerName = "") {
		this.playerName = playerName;
		this.gameBoard = new Gameboard();
	}
	returnGameboard() {
		return this.gameBoard.getGameboard();
	}
}

export { Ship, Gameboard, Player };

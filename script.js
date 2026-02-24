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
		this.length = length;
		this.numberOfHits = 0;
		this.sunkValue = false;
		this.name = name;
		this.coordinates = coordinates; // might not be needed
	}

	hit() {
		this.numberOfHits += 1;
	}

	isSunk() {
		if (this.length === this.numberOfHits) this.sunkValue = true;
	}
}

class Gameboard {
	constructor() {
		this.board = this.createBoard();
		this.ships = {};
		this.sunkShips = 0;
	}
	createBoard() {
		let gameBoardArray = [];
		// 0 - means empty, 1 - means occupied by ship, 2 - means hit
		for (let i = 0; i < 10; i += 1) {
			const arr = new Array(10).fill(0);
			gameBoardArray[i] = arr;
		}
		return gameBoardArray;
	}
	receiveAttack(coordinate) {}
	placeShip(length, coordinate, name, alignment = "") {
		const value = this.transformCoordinates(coordinate);
		/*  1. Need to check whether the coordinate is already taken (This won't be necessary as we'll be restricting the same from the UI)
			2. Need to check whether it can be placed vertically and horizontally
			3. Need to check whether the tiles below/above/ side ways are not taken by other ships
			4. Need to find a way to place the ship vertically and horizontally.
			5. *The co-ordinate will the top/tip of the ship.
		 */
		if (
			this.board[value[0]][value[1]] == 1 ||
			this.board[value[0]][value[1]] == 2
		) {
			console.log("Unable to place ship, try another co-ordinate!");
			return false;
			// DRY
		} else {
			// Need to add edge checks
			if (alignment.toLowerCase() == "v" || !alignment) {
				let allCoordinates = [value];
				let k = 0;
				for (let i = 1; i < length; i += 1) {
					if (this.board[value[0]][value[1] + i] == 0) {
						allCoordinates.push([value[0], value[1] + i]);
						continue;
					} else {
						k = 1;
						break;
					}
				}
				if (!k) {
					console.log(allCoordinates);
					for (let [x, y] of allCoordinates) {
						this.board[x][y] = 1;
					}
					this.ships[name] = new Ship(length, allCoordinates, name);
					return true;
				}
			} else {
				let allCoordinates = [value];
				let k = 0;
				for (let i = 1; i < length; i += 1) {
					if (this.board[value[0] + i][value[1]] == 0) {
						allCoordinates.push([value[0] + i, value[1]]);
						continue;
					} else {
						k = 1;
						break;
					}
				}
				if (!k) {
					console.log(allCoordinates);
					for (let [x, y] of allCoordinates) {
						this.board[x][y] = 1;
					}
					this.ships[name] = new Ship(length, allCoordinates, name);
					return true;
				} else {
					console.log(
						"Could not add ship to the board as the required cells are already taken by other ships. Please try again with a different co-ordinate!",
					);
					return false;
				}
			}
		}
	}
	calculateRemainingShips() {}
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
		return [keyValuePairs[splitString[0]], Number(splitString[1])];
	}
}

export { Ship, Gameboard };

import { Ship, Gameboard } from "./script";

test("Ship: hitFunction check", () => {
	const shipObj = new Ship(3, "E-4", "V");
	shipObj.hit();
	shipObj.hit();
	expect(shipObj.numberOfHits).toBe(2);
});

test("Ship: isSunk check - False", () => {
	const shipObj = new Ship(3, "E-4", "V");
	shipObj.hit();
	shipObj.hit();
	shipObj.isSunk();
	expect(shipObj.sunkValue).toBeFalsy();
});

test("Ship: isSunk check - True", () => {
	const shipObj = new Ship(3, "E-4", "V");
	shipObj.hit();
	shipObj.hit();
	shipObj.hit();
	shipObj.isSunk();
	expect(shipObj.sunkValue).toBeTruthy();
});

test("Gameboard: receiveAttack - right co-ordinate", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.receiveAttack("A-3")).toBeTruthy();
});

test("Gameboard: receiveAttack - incorrect co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.receiveAttack("T-3")).toBeFalsy();
});

test("Gameboard: receiveAttack - incorrect co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.receiveAttack("D-12")).toBeFalsy();
});

test("Gameboard: receiveAttack - same co-ordinate", () => {
	const gameBoard = new Gameboard();
	gameBoard.receiveAttack("B-2");
	expect(gameBoard.receiveAttack("B-2")).toBeFalsy();
});

test("Gameboard: placeShip - right co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-4", "Destroyer", "V")).toBeTruthy();
});

test("Gameboard: placeShip - right co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-4", "Destroyer", "H")).toBeTruthy();
});

test("Gameboard: placeShip - right co-ordinate (No axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-4", "Destroyer")).toBeTruthy();
});

// Need to add code from here
test("Gameboard: placeShip - end of the ship goes out of bound (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "I-4", "Destroyer", "H")).toBeFalsy();
});

test("Gameboard: placeShip - end of the ship goes out of bound (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "A-10", "Destroyer", "V")).toBeFalsy();
});

test("Gameboard: placeShip - incorrect co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "Y-4", "Destroyer", "V")).toBeFalsy();
});

test("Gameboard: placeShip - incorrect co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-11", "Destroyer", "V")).toBeFalsy();
});

test("Gameboard: placeShip - same co-ordinate", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "A-7", "Destroyer", "V");
	expect(gameBoard.placeShip(3, "A-7", "Destroyer", "V")).toBeFalsy();
});

test("Gameboard: placeShip - overlap check", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "A-7", "Destroyer", "V");
	expect(gameBoard.placeShip(3, "B-7", "Destroyer", "V")).toBeFalsy();
});

// No need to check for negative test cases like position having -1 etc as I am not allowing the user to enter the co-ordinates, rather letting them select the tile

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
	expect(gameBoard.receiveAttack("A-3")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - incorrect co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.receiveAttack("T-3")[1]).toBeFalsy();
});

test("Gameboard: receiveAttack - incorrect co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.receiveAttack("D-12")[1]).toBeFalsy();
});

test("Gameboard: receiveAttack - same co-ordinate", () => {
	const gameBoard = new Gameboard();
	gameBoard.receiveAttack("B-2");
	expect(gameBoard.receiveAttack("B-2")[1]).toBeFalsy();
});

test("Gameboard: receiveAttack - Hit a ship (top) horizontal", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "B-2", "Destroyer", "H");
	expect(gameBoard.receiveAttack("B-2")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - Hit a ship (middle) horizontal", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "B-2", "Destroyer", "H");
	expect(gameBoard.receiveAttack("C-2")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - Hit a ship (bottom) horizontal", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "B-2", "Destroyer", "H");
	expect(gameBoard.receiveAttack("D-2")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - Hit a ship (top) vertical", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "B-2", "Destroyer", "V");
	expect(gameBoard.receiveAttack("B-2")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - Hit a ship (middle) vertical", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "B-2", "Destroyer", "V");
	expect(gameBoard.receiveAttack("B-3")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - Hit a ship (bottom) vertical", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "B-2", "Destroyer", "V");
	expect(gameBoard.receiveAttack("B-4")[1]).toBeTruthy();
});

test("Gameboard: receiveAttack - sink a ship having length 3 (vertical)", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "E-2", "Destroyer", "V");
	gameBoard.receiveAttack("E-3");
	gameBoard.receiveAttack("E-2")[0];
	gameBoard.receiveAttack("E-4");
	expect(gameBoard.getSunkShips()).toBeTruthy();
});

test("Gameboard: receiveAttack - sink a ship having length 2 (horizontal)", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(2, "C-3", "Patrol Boat", "H");
	gameBoard.receiveAttack("D-3");
	gameBoard.receiveAttack("C-3");
	expect(gameBoard.getSunkShips()).toBeTruthy();
});

test("Gameboard: receiveAttack - same co-ordinate where a ship was previously present", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "E-2", "Destroyer", "V");
	gameBoard.receiveAttack("E-2");
	expect(gameBoard.receiveAttack("E-2")[1]).toBeFalsy();
});

test("Gameboard: placeShip - right co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-4", "Destroyer", "V")[1]).toBeTruthy();
});

test("Gameboard: placeShip - right co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-4", "Destroyer", "H")[1]).toBeTruthy();
});

test("Gameboard: placeShip - right co-ordinate (No axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-4", "Destroyer")[1]).toBeTruthy();
});

test("Gameboard: placeShip - end of the ship goes out of bounds (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "I-4", "Destroyer", "H")[1]).toBeFalsy();
});

test("Gameboard: placeShip - end of the ship goes out of bounds (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "A-10", "Destroyer", "V")[1]).toBeFalsy();
});

test("Gameboard: placeShip - incorrect co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "Y-4", "Destroyer", "V")[1]).toBeFalsy();
});

test("Gameboard: placeShip - incorrect co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(3, "E-11", "Destroyer", "V")[1]).toBeFalsy();
});

test("Gameboard: placeShip - same co-ordinate", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "A-7", "Destroyer");
	expect(gameBoard.placeShip(3, "A-7", "Destroyer", "H")[1]).toBeFalsy();
});

test("Gameboard: placeShip - overlap check", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(3, "A-7", "Destroyer", "H");
	expect(gameBoard.placeShip(3, "B-7", "Destroyer", "V")[1]).toBeFalsy();
});

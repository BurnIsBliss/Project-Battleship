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

test("Gameboard: placeShip - right co-ordinate", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(new Ship(3, "E-4", "V"))).toBeTruthy();
});

test("Gameboard: placeShip - incorrect co-ordinate (x-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(new Ship(3, "Y-4", "V"))).toBeFalsy();
});

test("Gameboard: placeShip - incorrect co-ordinate (y-axis)", () => {
	const gameBoard = new Gameboard();
	expect(gameBoard.placeShip(new Ship(3, "E--1", "V"))).toBeFalsy();
});

test("Gameboard: placeShip - same co-ordinate", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(new Ship(3, "A-7", "V"));
	expect(gameBoard.placeShip(new Ship(3, "A-7", "V"))).toBeFalsy();
});

test("Gameboard: placeShip - overlap check", () => {
	const gameBoard = new Gameboard();
	gameBoard.placeShip(new Ship(3, "A-7", "V"));
	expect(gameBoard.placeShip(new Ship(3, "B-7", "V"))).toBeFalsy();
});

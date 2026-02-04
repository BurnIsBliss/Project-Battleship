import { Ship } from "./script";

test("Ship: hitFunction check", () => {
	const shipObj = new Ship(3, "(E,4)", "V");
	shipObj.hit();
	shipObj.hit();
	expect(shipObj.numberOfHits).toBe(2);
});

test("Ship: isSunk check - False", () => {
	const shipObj = new Ship(3, "(E,4)", "V");
	shipObj.hit();
	shipObj.hit();
	shipObj.isSunk();
	expect(shipObj.sunkValue).toBeFalsy();
});

test("Ship: isSunk check - True", () => {
	const shipObj = new Ship(3, "(E,4)", "V");
	shipObj.hit();
	shipObj.hit();
	shipObj.hit();
	shipObj.isSunk();
	expect(shipObj.sunkValue).toBeTruthy();
});

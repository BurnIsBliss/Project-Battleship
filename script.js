class Ship {
	constructor(length, coordinates, placement) {
		this.length = length;
		this.numberOfHits = 0;
		this.sunkValue = false;
		this.placement = placement;
		this.coordinates = coordinates;
	}

	hit() {
		this.numberOfHits += 1;
	}

	isSunk() {
		console.log(this.length, this.numberOfHits);
		if (this.length === this.numberOfHits) this.sunkValue = true;
	}
}

export { Ship };

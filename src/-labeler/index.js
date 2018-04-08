exports.Labeler = class Labeler extends Map {

	label(value) {
		if (!this.has(value)) {
			this.set(value, this.size);
		}
		return this.get(value);
	}

};

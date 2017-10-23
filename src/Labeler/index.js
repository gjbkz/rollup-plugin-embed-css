class Labeler extends Map {

	constructor(name = '') {
		super();
		this.name = name;
	}

	label(value) {
		if (this.has(value)) {
			return this.get(value);
		}
		const label = this.size;
		this.set(value, label);
		return label;
	}

}

module.exports = Labeler;

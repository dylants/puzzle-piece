var puzzle = puzzle || {};

puzzle.didIWin = function() {
	var id, model;
	var totalSidesConnected = 0;

	// loop through all the puzzle pieces and count the sides connected
	for (id in puzzle.puzzlePieces) {
		model = puzzle.puzzlePieces[id].model;
		if (model && model.getSnappedToMeCounter() > 0) {
			totalSidesConnected = totalSidesConnected + model.getSnappedToMeCounter();
		}
	}

	console.log("***total connected sides: " + totalSidesConnected);

	// determing winning number only once
	puzzle.winningNumber = puzzle.winningNumber || puzzle.winningNumberOfSidesConnected();

	if (totalSidesConnected === puzzle.winningNumber) {
		console.log("*** YOU WON! ***");
	}
};

puzzle.winningNumberOfSidesConnected = function() {
	// the algorithm to determine if we've won -- meaning if the number
	// of sides connected is equal to that of a square -- is this:
	// (4 * 2) + ((n - 2) * 4 * 3) + ((n - 2) ^ 2 * 4)
	// where n = number of pieces on one side of a square
	// (credit for this algorithm goes to @digitalicarus)

	// let's find n, by taking the square root of the number of pieces
	// remember n is the number of pieces on one edge of a square, when
	// all available pieces are used. So for a 4 piece puzzle, it will 
	// make a 2x2 square, which means n = 2. Similarly, a 9 piece puzzle
	// will make a 3x3 square, which means n = 3.
	var n = Math.sqrt(_.size(puzzle.puzzlePieces));
	console.log("n is equal to " + n);

	// now for the algorithm
	// (4 * 2) + ((n - 2) * 4 * 3) + ((n - 2) ^ 2 * 4)
	var algorithm = function(n) {
		return (4 * 2) + ((n - 2) * 4 * 3) + (Math.pow((n - 2), 2) * 4);
	};

	// let's run the algorithm on our value for n
	var winningNumber = algorithm(n);
	console.log("winning number: " + winningNumber);
	return winningNumber;
}

// static set of puzzle pieces for a 3x3 square
puzzle.puzzlePieces = {
	"p1": {
		topValue: 4,
		leftValue: 1,
		rightValue: -2,
		bottomValue: -3
	},//1
	"p2": {
		topValue: -1,
		leftValue: -4,
		rightValue: 2,
		bottomValue: 3
	},//9
	"p3": {
		topValue: 3,
		leftValue: 2,
		rightValue: -4,
		bottomValue: -1
	},//4
	"p4": {
		topValue: 1,
		leftValue: -2,
		rightValue: 1,
		bottomValue: -3
	},//7
	"p5": {
		topValue: -2,
		leftValue: 3,
		rightValue: -1,
		bottomValue: 3
	},//3
	"p6": {
		topValue: -4,
		leftValue: 4,
		rightValue: -2,
		bottomValue: 1
	},//5
	"p7": {
		topValue: -1,
		leftValue: -1,
		rightValue: 4,
		bottomValue: -3
	},//8
	"p8": {
		topValue: -1,
		leftValue: 2,
		rightValue: -3,
		bottomValue: 4
	},//2
	"p9": {
		topValue: -3,
		leftValue: 2,
		rightValue: -3,
		bottomValue: 1
	}//6
};

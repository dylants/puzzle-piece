var puzzle = puzzle || {};

puzzle.addPuzzlePiece = function(n) {
	// create a piece
	var piece = new puzzle.Piece({
		name: "id" + n,
		topValue: n,
		leftValue: n,
		rightValue: n,
		bottomValue: n
	});

	// add it to our list of pieces
	puzzle.pieces[piece.get("name")] = piece;

	// create a view using the piece, and add it to our page
	var pieceView = new puzzle.PieceView({ model: piece});
	$('#pieces').append(pieceView.render().el);
};

puzzle.findSnappedPieces = function(event, ui) {
	// define some vars used below
	var snapped, snappedTo;
	var piecePairsArray = [];
	var piecePairs = {};

	// determine if there are any pieces snapped together
	snapped = $(this).data("draggable").snapElements;
	snappedTo = $.map(snapped, function(element) {
		return element.snapping ? element.item : null;
	});

	// if there are pieces snapped together, find the snap numbers
	if (snappedTo && snappedTo.length > 0) {
		// We can determine where it's snapped based on the offsets
		for (var i=0; i<snappedTo.length; i++) {

			// find the data for the pieces snapped together
			piecePairs = (function(pieceA, pieceB) {
				if (pieceA.offsetLeft === pieceB.offsetLeft) {
					// they are on top of eachother
					if (pieceA.offsetTop > pieceB.offsetTop) {
						// piece A is below piece B
						return {
							pieceAId: pieceA.id,
							pieceANumber: puzzle.pieces[pieceA.id].get("topValue"),
							pieceBId: pieceB.id,
							pieceBNumber: puzzle.pieces[pieceB.id].get("bottomValue")
						};
					} else {
						// piece A is above piece B
						return {
							pieceAId: pieceA.id,
							pieceANumber: puzzle.pieces[pieceA.id].get("bottomValue"),
							pieceBId: pieceB.id,
							pieceBNumber: puzzle.pieces[pieceB.id].get("topValue")
						};
					}
				} else if (pieceA.offsetTop === pieceB.offsetTop) {
					// they are side by side
					if (pieceA.offsetLeft > pieceB.offsetLeft) {
						// piece A is to the right of piece B
						return {
							pieceAId: pieceA.id,
							pieceANumber: puzzle.pieces[pieceA.id].get("leftValue"),
							pieceBId: pieceB.id,
							pieceBNumber: puzzle.pieces[pieceB.id].get("rightValue")
						};
					} else {
						// piece A is to the left of piece B
						return {
							pieceAId: pieceA.id,
							pieceANumber: puzzle.pieces[pieceA.id].get("rightValue"),
							pieceBId: pieceB.id,
							pieceBNumber: puzzle.pieces[pieceB.id].get("leftValue")
						};
					}
				}
			})(this, snappedTo[i]);

			if (piecePairs) {
				// add each piece pair data to the array
				piecePairsArray.push(piecePairs);						
			}
		}
	}

	puzzle.printPairs(piecePairsArray);
};


puzzle.printPairs = function(piecePairsArray) {
	var piecePairs;
	if (piecePairsArray && piecePairsArray.length > 0) {
		for (var i=0; i<piecePairsArray.length; i++) {
			piecePairs = piecePairsArray[i];
			console.log("piece: " + piecePairs.pieceAId + " side " + piecePairs.pieceANumber + 
				" connected to " + piecePairs.pieceBId + " side " + piecePairs.pieceBNumber);
		}
	}
};
var puzzle = puzzle || {};

puzzle.pieceDraggableStart = function(event, ui) {
	// when we start moving a piece, we must clear fit classes
	$(this).removeClass("pieceFits").removeClass("pieceDoesNotFit");
};

puzzle.pieceDraggableStop = function(event, ui) {
	// when we stop moving a piece, we find the snapped pieces
	puzzle.findSnappedPieces(event, ui, this);
};

puzzle.findSnappedPieces = function(element, ui, that) {
	// define some vars used below
	var snapped, snappedTo;
	var piecePairsArray = [];
	var piecePairs = {};

	// determine if there are any pieces snapped together
	snapped = $(that).data("draggable").snapElements;
	snappedTo = $.map(snapped, function(element) {
		return element.snapping ? element.item : null;
	});

	// if there are pieces snapped together, find the snap numbers
	if (snappedTo && snappedTo.length > 0) {
		// We can determine where it's snapped based on the offsets
		for (var i=0; i<snappedTo.length; i++) {

			// find the data for the pieces snapped together
			piecePairs = puzzle.findPiecePairs(that, snappedTo[i]);

			if (piecePairs) {
				// add each piece pair data to the array
				piecePairsArray.push(piecePairs);						
			}
		}

		// now alert the user if these pieces fit
		puzzle.verifyPieceFits(piecePairsArray);
	}

};

puzzle.findPiecePairs = function(pieceA, pieceB) {
	if (pieceA.offsetLeft === pieceB.offsetLeft) {
		// they are on top of eachother
		if (pieceA.offsetTop > pieceB.offsetTop) {
			// piece A is below piece B
			return {
				pieceAId: pieceA.id,
				pieceASide: "top",
				pieceANumber: puzzle.puzzlePieces[pieceA.id].topValue,
				pieceBId: pieceB.id,
				pieceBSide: "bottom",
				pieceBNumber: puzzle.puzzlePieces[pieceB.id].bottomValue
			};
		} else {
			// piece A is above piece B
			return {
				pieceAId: pieceA.id,
				pieceASide: "bottom",
				pieceANumber: puzzle.puzzlePieces[pieceA.id].bottomValue,
				pieceBId: pieceB.id,
				pieceBSide: "top",
				pieceBNumber: puzzle.puzzlePieces[pieceB.id].topValue
			};
		}
	} else if (pieceA.offsetTop === pieceB.offsetTop) {
		// they are side by side
		if (pieceA.offsetLeft > pieceB.offsetLeft) {
			// piece A is to the right of piece B
			return {
				pieceAId: pieceA.id,
				pieceASide: "left",
				pieceANumber: puzzle.puzzlePieces[pieceA.id].leftValue,
				pieceBId: pieceB.id,
				pieceBSide: "right",
				pieceBNumber: puzzle.puzzlePieces[pieceB.id].rightValue
			};
		} else {
			// piece A is to the left of piece B
			return {
				pieceAId: pieceA.id,
				pieceASide: "right",
				pieceANumber: puzzle.puzzlePieces[pieceA.id].rightValue,
				pieceBId: pieceB.id,
				pieceBSide: "left",
				pieceBNumber: puzzle.puzzlePieces[pieceB.id].leftValue
			};
		}
	} else {
		// in this case, we're dealing with data from surrounding pieces that
		// were not part of this piece's direct neighbors. jQueryUI provides
		// additional data, but it's of no use to us here, so ignore it.
	}
};

puzzle.verifyPieceFits = function(piecePairsArray) {
	var doesItFit = true;
	var fitPieceIds = [];
	var failPieceIds = [];

	// loop on the array to make sure each pieceA fits with pieceB
	if (piecePairsArray && piecePairsArray.length > 0) {
		for (var i=0; i<piecePairsArray.length; i++) {
			// get the piece pairs data
			var piecePairs = piecePairsArray[i];

			console.log("piece: " + piecePairs.pieceAId + " side " + piecePairs.pieceANumber + 
				" connected to " + piecePairs.pieceBId + " side " + piecePairs.pieceBNumber);

			// does piece A fit with piece B?
			if (piecePairs.pieceANumber + piecePairs.pieceBNumber !== 0) {
				// awww... you failed at life
				doesItFit = false;
				if (failPieceIds.indexOf(piecePairs.pieceAId) === -1) {
					failPieceIds.push(piecePairs.pieceAId);
				}
				if (failPieceIds.indexOf(piecePairs.pieceBId) === -1) {
					failPieceIds.push(piecePairs.pieceBId);
				}
			} else {
				// yay! win! let's remember these IDs for later
				if (fitPieceIds.indexOf(piecePairs.pieceAId) === -1) {
					fitPieceIds.push(piecePairs.pieceAId);
				}
				if (fitPieceIds.indexOf(piecePairs.pieceBId) === -1) {
					fitPieceIds.push(piecePairs.pieceBId);
				}
			}
		}
	}

	if (doesItFit) {
		console.log("*** YES ***");
		for (var i=0; i<fitPieceIds.length; i++) {
			$("#" + fitPieceIds[i]).addClass("pieceFits");
		}
	} else {
		console.log("*** NO ***");
		for (var i=0; i<failPieceIds.length; i++) {
			$("#" + failPieceIds[i]).addClass("pieceDoesNotFit");
		}
	}
};

puzzle.flippersDroppableDrop = function(event, ui) {
	// when we drop a piece in this droppable, reset the offset
	// to center the piece in this area.
	// 90 / 4 is the additional area, we divide by 2 to get the one side
	var offsetTop = $(this).offset().top + ((90 / 3) / 2);
	var offsetLeft = $(this).offset().left + ((90 / 3) / 2);
	$(ui.draggable).offset({
		top: offsetTop,
		left: offsetLeft
	});

	// now flip the piece based on the flipper
	var flipperId = this.id;
	var pieceId = ui.draggable.context.id
	var piece = puzzle.puzzlePieces[pieceId];
	console.log(JSON.stringify(puzzle.puzzlePieces[pieceId]));
	if (flipperId.indexOf("horizontal") !== -1) {
		// flip horizontally
		console.log("flip horizontally " + pieceId);
		var oldLeft = piece.leftValue;
		var oldRight = piece.rightValue;
		// flip the values for this piece in our static puzzle piece object
		piece.leftValue = oldRight;
		piece.rightValue = oldLeft;
		// backbone's driving the rendering, so set it there as well
		var model = piece.model;
		model.set("leftValue", oldRight);
		model.set("rightValue", oldLeft);
	} else {
		// flip vertically
		console.log("flip vertically " + pieceId);
		var oldTop = piece.topValue;
		var oldBottom = piece.bottomValue;
		// flip the values for this piece in our static puzzle piece object
		piece.topValue = oldBottom;
		piece.bottomValue = oldTop;
		// backbone's driving the rendering, so set it there as well
		var model = piece.model;
		model.set("topValue", oldBottom);
		model.set("bottomValue", oldTop);
	}
	console.log(JSON.stringify(puzzle.puzzlePieces[pieceId]));
};

puzzle.flippersDroppableOver = function(event, ui) {
	// clear the content when we move a piece over our flipper
	$("#" + this.id + ' .flip-content').css("display", "none")
}

puzzle.flippersDroppableOut = function(event, ui) {
	// restore the content when we move a piece out of our flipper
	$("#" + this.id + ' .flip-content').css("display", "")
}




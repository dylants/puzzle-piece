var puzzle = puzzle || {};

puzzle.pieceDraggableStart = function(event, ui) {
	// when we start to move a piece, we're essentially detaching it from
	// the other pieces that were snapped to it. This means we must modify
	// the piece model's ID snapped arrays


	// let's start by looking at the pieces connected to this piece
	var model = puzzle.puzzlePieces[this.id].model;
	// if this piece has any connected pieces, we must do some work
	if (model.get("pieceIdsSnappedToMe").length > 0) {
		// for each piece ID connected, remove this piece ID from it's list of connected
		// (since we're moving this piece away from it)
		for (var i=0; i<model.get("pieceIdsSnappedToMe").length; i++) {
			var connectedPieceModel = puzzle.puzzlePieces[model.get("pieceIdsSnappedToMe")[i]].model;
			connectedPieceModel.removePieceIdSnappedToMe(this.id);
			console.log(connectedPieceModel.get("id") + " is no longer connected to " + this.id);

			// if at this point, this connected piece has no more pieces connected,
			// then clear it's piece fits class
			$(connectedPieceModel.get("id")).removeClass("piece-fits");
		}

		// after that, clear the pieceIdsSnappedToMe since we're moving this piece out
		model.clearPieceIdsSnappedToMe();
		console.log(this.id + " is no longer connected to anything");
	}

	// finally let's clear the piece fits classes from our moving piece
	$(this).removeClass("piece-fits").removeClass("piece-does-not-fit");
};

puzzle.pieceDraggableStop = function(event, ui) {
	// determine if there are any pieces snapped to the piece that was moved
	var piecesSnappedToMe = puzzle.findPiecesSnappedToMe(this);

	// if the user snapped this piece to (at least) one other piece
	if (piecesSnappedToMe && piecesSnappedToMe.length > 0) {
		// show the user the outcome of the snap
		puzzle.pieceWasSnapped(this, piecesSnappedToMe);
	}
};

puzzle.pieceWasSnapped = function(movedPiece, piecesSnappedToMovedPiece) {
	// define some vars used below
	var snapData = {};
	var snapDataArray = [];

	for (var i=0; i<piecesSnappedToMovedPiece.length; i++) {

		// find the data for the pieces snapped together
		snapData = puzzle.loadSnapData(movedPiece, piecesSnappedToMovedPiece[i]);

		if (snapData) {
			// add each piece pair data to the array
			snapDataArray.push(snapData);
		}
	}

	// now alert the user if these pieces fit
	puzzle.showUserIfPieceFits(snapDataArray);
};

puzzle.findPiecesSnappedToMe = function(pieceQuery) {
	var snappedToMe;

	var snapElements = $(pieceQuery).data("draggable").snapElements;
	if (snapElements) {
		snappedToMe = $.map(snapElements, function(snapElement) {
			return snapElement.snapping ? snapElement.item : null;
		});
	}

	return snappedToMe;
}

puzzle.loadSnapData = function(pieceA, pieceB) {
	// We can determine where it's snapped based on the offsets
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

puzzle.showUserIfPieceFits = function(snapDataArray) {
	var failurePairs = {};
	var successPairs = {};
	var i, pieceAId, snapData;

	// loop on the array to make sure each pieceA fits with pieceB
	if (snapDataArray && snapDataArray.length > 0) {
		for (i=0; i<snapDataArray.length; i++) {
			snapData = snapDataArray[i];

			console.log("piece: " + snapData.pieceAId + " side " + snapData.pieceANumber + 
				" connected to " + snapData.pieceBId + " side " + snapData.pieceBNumber);

			// does piece A fit with piece B?
			if (snapData.pieceANumber + snapData.pieceBNumber !== 0) {
				// awww... you failed at life, remember for later
				if (!failurePairs[snapData.pieceAId]) {
					// store piece B's ID under piece A
					failurePairs[snapData.pieceAId] = [snapData.pieceBId];
				} else {
					// add piece B's ID to piece A
					failurePairs[snapData.pieceAId].push(snapData.pieceBId);
				}
			} else {
				// yay! win! let's store off the ids to set if there are no failures
				if (!successPairs[snapData.pieceAId]) {
					// store piece B's ID under piece A
					successPairs[snapData.pieceAId] = [snapData.pieceBId];
				} else {
					// add piece B's ID to piece A
					successPairs[snapData.pieceAId].push(snapData.pieceBId);
				}
			}
		}

		// if there are some failures, handle them all at once
		if (!$.isEmptyObject(failurePairs)) {
			for (pieceAId in failurePairs) {
				// first show failure on the main piece
				$("#" + pieceAId).addClass("piece-does-not-fit");
				// now for every additional piece, mark it as so too
				for (i=0; i<failurePairs[pieceAId].length; i++) {
					$("#" + failurePairs[pieceAId][i]).addClass("piece-does-not-fit");
				}
				// move the main piece back to the start
				$("#" + pieceAId).animate({
					top: 0,
					left: 0
				}, {
					duration: 1000,
					complete: function() {
						// remove that you've failed (and/or that you've won for piece A)
						$("#" + pieceAId).removeClass("piece-does-not-fit").removeClass("piece-fits");
						for (i=0; i<failurePairs[pieceAId].length; i++) {
							$("#" + failurePairs[pieceAId][i]).removeClass("piece-does-not-fit");
						}
					}
				});
			}
		} else if (!$.isEmptyObject(successPairs)) {
			// loop over all the success IDs, update the models, and highlight them
			for (pieceAId in successPairs) {
				// highlight piece A
				$("#" + pieceAId).addClass("piece-fits");
				for (i=0; i<successPairs[pieceAId].length; i++) {
					// add this piece to piece A's connected to array
					puzzle.puzzlePieces[pieceAId].model.addPieceIdSnappedToMe(successPairs[pieceAId][i]);
					console.log(pieceAId + " is now connected to " + successPairs[pieceAId][i]);
					// and add piece A to this piece's connected array
					puzzle.puzzlePieces[successPairs[pieceAId][i]].model.addPieceIdSnappedToMe(pieceAId);
					console.log(successPairs[pieceAId][i] + " is now connected to " + pieceAId);
					// and highlight this piece
					$("#" + successPairs[pieceAId][i]).addClass("piece-fits");
				}
			}
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
	var oldTop, oldLeft, oldRight, oldBottom, model;
	console.log(JSON.stringify(puzzle.puzzlePieces[pieceId]));
	if (flipperId.indexOf("horizontal") !== -1) {
		// flip horizontally
		console.log("flip horizontally " + pieceId);
		oldLeft = piece.leftValue;
		oldRight = piece.rightValue;
		// flip the values for this piece in our static puzzle piece object
		piece.leftValue = oldRight;
		piece.rightValue = oldLeft;
		// backbone's driving the rendering, so set it there as well
		model = piece.model;
		model.set("leftValue", oldRight);
		model.set("rightValue", oldLeft);
	} else if (flipperId.indexOf("vertical") !== -1) {
		// flip vertically
		console.log("flip vertically " + pieceId);
		oldTop = piece.topValue;
		oldBottom = piece.bottomValue;
		// flip the values for this piece in our static puzzle piece object
		piece.topValue = oldBottom;
		piece.bottomValue = oldTop;
		// backbone's driving the rendering, so set it there as well
		model = piece.model;
		model.set("topValue", oldBottom);
		model.set("bottomValue", oldTop);
	} else if (flipperId.indexOf("spin-right") !== -1) {
		// spin to the right
		console.log("spin to the right " + pieceId);
		oldTop = piece.topValue;
		oldLeft = piece.leftValue;
		oldRight = piece.rightValue;
		oldBottom = piece.bottomValue;
		// spin the piece to the right in our static puzzle piece object
		piece.topValue = oldLeft;
		piece.leftValue = oldBottom;
		piece.rightValue = oldTop;
		piece.bottomValue = oldRight;
		// backbone's driving the rendering, so set it there as well
		model = piece.model;
		model.set("topValue", oldLeft);
		model.set("leftValue", oldBottom);
		model.set("rightValue", oldTop);
		model.set("bottomValue", oldRight);
	} else if (flipperId.indexOf("spin-left") !== -1) {
		// spin to the left
		console.log("spin to the left " + pieceId);
		oldTop = piece.topValue;
		oldLeft = piece.leftValue;
		oldRight = piece.rightValue;
		oldBottom = piece.bottomValue;
		// spin the piece to the left in our static puzzle piece object
		piece.topValue = oldRight;
		piece.leftValue = oldTop;
		piece.rightValue = oldBottom;
		piece.bottomValue = oldLeft;
		// backbone's driving the rendering, so set it there as well
		model = piece.model;
		model.set("topValue", oldRight);
		model.set("leftValue", oldTop);
		model.set("rightValue", oldBottom);
		model.set("bottomValue", oldLeft);
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




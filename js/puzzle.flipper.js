puzzle.flipper = puzzle.flipper || {};

puzzle.flipper.droppableDrop = function(event, ui) {
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

puzzle.flipper.droppableOver = function(event, ui) {
	// clear the content when we move a piece over our flipper
	$("#" + this.id + ' .flip-content').css("display", "none")
};

puzzle.flipper.droppableOut = function(event, ui) {
	// restore the content when we move a piece out of our flipper
	$("#" + this.id + ' .flip-content').css("display", "")
};

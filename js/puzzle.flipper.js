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

	// remove the content from view
	$("#" + this.id + ' .toggle-content').css("display", "none");

	// now flip the piece based on the flipper
	var flipperId = this.id;
	var pieceId = ui.draggable.context.id
	var piece = puzzle.puzzlePieces[pieceId];
	var oldTop, oldLeft, oldRight, oldBottom, model;
	console.log(JSON.stringify(puzzle.puzzlePieces[pieceId]));
	if (flipperId.indexOf("horizontal") !== -1) {
		// play the flip sound
		document.getElementById("audio-flip").play();
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
		puzzle.flipper.flipPieceY(model);
	} else if (flipperId.indexOf("vertical") !== -1) {
		// play the flip sound
		document.getElementById("audio-flip").play();
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
		puzzle.flipper.flipPieceX(model);
	} else if (flipperId.indexOf("spin-right") !== -1) {
		// play the spin sound
		document.getElementById("audio-spin").play();
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
		puzzle.flipper.spinPiece(model, true);
	} else if (flipperId.indexOf("spin-left") !== -1) {
		// play the spin sound
		document.getElementById("audio-spin").play();
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
		puzzle.flipper.spinPiece(model, false);
	}
	console.log(JSON.stringify(puzzle.puzzlePieces[pieceId]));
};

puzzle.flipper.flipPieceX = function(model) {
	var rotateXValue;

	// here we want to take the existing rotateX value found in the model,
	// (which represents the value in the transform css property), and add
	// 180 degrees to it to "flip" the piece along the X axis.
	rotateXValue = model.get("rotateX");
	rotateXValue += 180;
	model.set("rotateX", rotateXValue);

	// now set it as the css property to flip the piece
	puzzle.flipper.setCSSTransform(model.get("id"), rotateXValue, model.get("rotateY"), model.get("rotate"));
};

puzzle.flipper.flipPieceY = function(model) {
	var rotateYValue;

	// here we want to take the existing rotateY value found in the model,
	// (which represents the value in the transform css property), and add
	// 180 degrees to it to "flip" the piece along the Y axis.
	rotateYValue = model.get("rotateY");
	rotateYValue += 180;
	model.set("rotateY", rotateYValue);

	// now set it as the css property to flip the piece
	puzzle.flipper.setCSSTransform(model.get("id"), model.get("rotateX"), rotateYValue, model.get("rotate"));
};

puzzle.flipper.spinPiece = function(model, toRight) {
	var rotateValue, rotateXValue, rotateYValue, opposite;

	// here we want to take the existing rotate value found in the model,
	// (which represents the value in the transform css property), and either
	// add or subtract (depending on if it's toRight or not) 90 degrees to
	// it to "spin" the piece.  To make things more interesting (hah!), if
	// the piece is currently rotated in the x + y direction a factor of 180
	// degrees, we must spin the opposite way.  If it's a factor of 360, it's
	// the same as if it was not rotated at all.
	rotateXValue = model.get("rotateX");
	rotateYValue = model.get("rotateY");
	if (((rotateXValue + rotateYValue) % 360) === 0) {
		opposite = false;
	} else {
		opposite = true;
	}

	rotateValue = model.get("rotate");
	if (toRight) {
		if (opposite) {
			rotateValue -= 90;			
		} else {
			rotateValue += 90;			
		}
	} else {
		if (opposite) {
			rotateValue += 90;			
		} else {
			rotateValue -= 90;			
		}
	}
	model.set("rotate", rotateValue);

	// now set it as the css property to spin the piece
	puzzle.flipper.setCSSTransform(model.get("id"), rotateXValue, rotateYValue, rotateValue);
};

puzzle.flipper.setCSSTransform = function(id, rotateX, rotateY, rotate) {
	$("#" + id).css("-webkit-transform", "rotateX(" + rotateX + "deg) " 
		+ "rotateY(" + rotateY + "deg) " + "rotate(" + rotate + "deg)");
	$("#" + id).css("-moz-transform", "rotateX(" + rotateX + "deg) " 
		+ "rotateY(" + rotateY + "deg) " + "rotate(" + rotate + "deg)");
	$("#" + id).css("transform", "rotateX(" + rotateX + "deg) " 
		+ "rotateY(" + rotateY + "deg) " + "rotate(" + rotate + "deg)");
}

puzzle.flipper.droppableOver = function(event, ui) {
	// clear the content when we move a piece over our flipper
	$("#" + this.id + ' .toggle-content').css("color", "#3393CC");
};

puzzle.flipper.droppableOut = function(event, ui) {
	// restore the content when we move a piece out of our flipper
	$("#" + this.id + ' .toggle-content').css("display", "").css("color", "");
};

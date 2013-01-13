var puzzle = puzzle || {};

$(function( $ ) {
	'use strict';

	puzzle.PuzzleView = Backbone.View.extend({

		el: '#puzzle',

		events: {
		},

		initialize: function() {
			// Add all the pieces to the puzzle
			for (var name in puzzle.puzzlePieces) {
				this.addPuzzlePiece(name);
			}

			// allow the pieces to be moved around
			$('.piece').draggable({
				snap: ".piece",
				snapMode: "both",
				start: puzzle.pieceDraggableStart,
				stop: puzzle.pieceDraggableStop
			});

			// now setup the flip boxes
			$('#flip-horizontally').droppable({
				drop: puzzle.flippersDroppableDrop,
				over: puzzle.flippersDroppableOver,
				out: puzzle.flippersDroppableOut
			});
			$('#flip-vertically').droppable({
				drop: puzzle.flippersDroppableDrop,
				over: puzzle.flippersDroppableOver,
				out: puzzle.flippersDroppableOut
			});
		},

		render: function() {
		},

		addPuzzlePiece: function(puzzlePieceName) {
			// retrieve the values of the puzzle piece
			var puzzlePieceValues = puzzle.puzzlePieces[puzzlePieceName];

			// create a piece
			var pieceModel = new puzzle.Piece({
				name: puzzlePieceName,
				topValue: puzzlePieceValues.topValue,
				leftValue: puzzlePieceValues.leftValue,
				rightValue: puzzlePieceValues.rightValue,
				bottomValue: puzzlePieceValues.bottomValue
			});

			// remember the model for later
			puzzlePieceValues.model = pieceModel;

			// create a view using the piece, and add it to our page
			var pieceView = new puzzle.PieceView({ model: pieceModel });
			$('#pieces').append(pieceView.render().el);
		}
	});
});
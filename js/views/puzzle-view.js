var puzzle = puzzle || {};

$(function( $ ) {
	'use strict';

	puzzle.PuzzleView = Backbone.View.extend({

		el: '#puzzle',

		events: {
		},

		initialize: function() {
			// Add all the pieces to the puzzle
			for (var id in puzzle.puzzlePieces) {
				this.addPuzzlePiece(id);
			}
			// after all the pieces have been added, remove the last space filler
			$('#pieces .piece-space-filler:last-child').remove();

			// allow the pieces to be moved around
			$('.piece').draggable({
				snap: ".piece",
				snapMode: "both",
				start: puzzle.piece.draggableStart,
				stop: puzzle.piece.draggableStop
			});

			// now setup the flip boxes
			$('#flip-horizontally, #flip-vertically, #spin-right, #spin-left').droppable({
				drop: puzzle.flipper.droppableDrop,
				over: puzzle.flipper.droppableOver,
				out: puzzle.flipper.droppableOut
			});
		},

		render: function() {
		},

		addPuzzlePiece: function(puzzlePieceId) {
			// retrieve the values of the puzzle piece
			var puzzlePieceValues = puzzle.puzzlePieces[puzzlePieceId];

			// create a piece
			var pieceModel = new puzzle.PieceModel({
				id: puzzlePieceId,
				topValue: puzzlePieceValues.topValue,
				leftValue: puzzlePieceValues.leftValue,
				rightValue: puzzlePieceValues.rightValue,
				bottomValue: puzzlePieceValues.bottomValue
			});

			// remember the model for later
			puzzlePieceValues.model = pieceModel;

			// create a view using the piece, and add it to our page
			var pieceView = new puzzle.PieceView({ model: pieceModel });
			// append the piece and a space filler to make the individual pieces easier to see
			$('#pieces').append(pieceView.render().el).append('<span class="piece-space-filler"></span');
		}
	});
});
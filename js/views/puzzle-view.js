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
				this.addPuzzlePiece(name, puzzle.puzzlePieces[name]);
			}

			// allow the pieces to be moved around
			$('.piece').draggable({
				snap: ".piece",
				snapMode: "both",
				start: function() {
					// when we start moving a piece, we must clear fit classes
					$(this).removeClass("pieceFits").removeClass("pieceDoesNotFit");
				},
				stop: puzzle.findSnappedPieces
			});
		},

		render: function() {
		},

		addPuzzlePiece: function(name, puzzlePieceValues) {
			// create a piece
			var piece = new puzzle.Piece({
				name: name,
				topValue: puzzlePieceValues.topValue,
				leftValue: puzzlePieceValues.leftValue,
				rightValue: puzzlePieceValues.rightValue,
				bottomValue: puzzlePieceValues.bottomValue
			});

			// create a view using the piece, and add it to our page
			var pieceView = new puzzle.PieceView({ model: piece });
			$('#pieces').append(pieceView.render().el);
		}
	});
});
var puzzle = puzzle || {};

$(function( $ ) {
	'use strict';

	puzzle.PuzzleView = Backbone.View.extend({

		el: '#puzzle',

		events: {
		},

		initialize: function() {
			// a reference to all the pieces
			puzzle.pieces = {};

			// Add 4 pieces to the puzzle
			for (var i=1; i<5; i++) {
				puzzle.addPuzzlePiece(i);
			}

			// allow the pieces to be moved around
			$('.piece').draggable({
				snap: ".piece",
				snapMode: "both",
				stop: puzzle.findSnappedPieces
			});
		},

		render: function() {
		}
	});
});
var app = app || {};

$(function( $ ) {
	'use strict';

	app.PuzzleView = Backbone.View.extend({

		el: '#puzzle',

		events: {
		},

		initialize: function() {
			// Add 5 pieces to the puzzle
			for (var i=0; i<5; i++) {
				this.addPuzzlePiece(i);
			}

			// allow the pieces to be moved around
			$('.piece').draggable();
		},

		render: function() {
		},

		addPuzzlePiece: function(n) {
			var piece = new app.Piece({
				name: n
			});
			var pieceView = new app.PieceView({ model: piece});
			$('#pieces').append(pieceView.render().el);
		}

	});
});
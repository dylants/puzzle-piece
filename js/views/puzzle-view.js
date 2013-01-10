var app = app || {};

$(function( $ ) {
	'use strict';

	app.PuzzleView = Backbone.View.extend({

		el: '#puzzle',

		events: {
		},

		initialize: function() {
			// Add 4 pieces to the puzzle
			for (var i=1; i<5; i++) {
				this.addPuzzlePiece(i);
			}

			// allow the pieces to be moved around
			$('.piece').draggable({
				snap: true,
				snapMode: "both"
			});
		},

		render: function() {
		},

		addPuzzlePiece: function(n) {
			var piece = new app.Piece({
				topValue: n,
				leftValue: n,
				rightValue: n,
				bottomValue: n
			});
			var pieceView = new app.PieceView({ model: piece});
			$('#pieces').append(pieceView.render().el);
		}

	});
});
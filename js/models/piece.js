var puzzle = puzzle || {};

$(function() {
	'use strict';

	puzzle.Piece = Backbone.Model.extend({

		defaults: {
			name: "myName",
			topValue: 0,
			leftValue: 0,
			rightValue: 0,
			bottomValue: 0
		}

	});

});

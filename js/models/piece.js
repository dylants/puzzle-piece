var app = app || {};

$(function() {
	'use strict';

	app.Piece = Backbone.Model.extend({

		defaults: {
			topValue: 0,
			leftValue: 0,
			rightValue: 0,
			bottomValue: 0
		},

	});

});

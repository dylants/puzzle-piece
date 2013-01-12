var puzzle = puzzle || {};

$(function() {
	'use strict';

	puzzle.Workspace = Backbone.Router.extend({
		routes:{
			'.*': 'index'
		},

		index: function() {
			// do nothing
		}
	});

	puzzle.PuzzleRouter = new puzzle.Workspace();
	new puzzle.PuzzleView();
	Backbone.history.start();

});

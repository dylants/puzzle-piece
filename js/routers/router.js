var app = app || {};

$(function() {
	'use strict';

	var Workspace = Backbone.Router.extend({
		routes:{
			'.*': 'index'
		},

		index: function() {
			// do nothing
		}
	});

	app.PuzzleRouter = new Workspace();
	new app.PuzzleView();
	Backbone.history.start();

});

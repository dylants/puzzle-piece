var puzzle = puzzle || {};

$(function() {
	'use strict';

	puzzle.Piece = Backbone.Model.extend({

		// normally we can just set the defaults as a hash, but because
		// we have an object (the pieceIdsSnappedToMe array), it will be
		// passed by reference to all instances of this model. In that
		// case we must use a function for defaults which will create a
		// new array for each instance of this model.
		// @see http://backbonejs.org/#Model-defaults
		// @see http://stackoverflow.com/a/9975060
		defaults: function() {
			return {
				id: 0,
				topValue: 0,
				leftValue: 0,
				rightValue: 0,
				bottomValue: 0,
				pieceIdsSnappedToMe: []
			};
		},

		// in order to use save() in the methods below, we must either
		// configure our model/collection to have a backend storage through
		// REST APIs, or configure local storage. Neither are really needed
		// for this application since the state is not intended to be
		// preserved, so we won't use local storage here.
		//localStorage: new Store("Puzzle"),

		getSnappedToMeCounter: function() {
			return this.get("pieceIdsSnappedToMe").length;
		},

		addPieceIdSnappedToMe: function(pieceId) {
			// add the piece ID to the pieceIdsSnappedToMe array
			this.get("pieceIdsSnappedToMe").push(pieceId);
		},

		removePieceIdSnappedToMe: function(pieceId) {
			// to remove the ID, we'll splice the array at the index of the pieceId
			this.get("pieceIdsSnappedToMe").splice(
				this.attributes.pieceIdsSnappedToMe.indexOf(pieceId), 1);
		},

		clearPieceIdsSnappedToMe: function() {
			// to clear the array, let's just set it to empty array
			this.set("pieceIdsSnappedToMe", []);
		}

	});

});

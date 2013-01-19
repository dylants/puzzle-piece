var puzzle = puzzle || {};

$(function() {
	'use strict';

	puzzle.Piece = Backbone.Model.extend({

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

		// not really necessary in this prototype app, but hey, why not?
		localStorage: new Store("Puzzle"),

		getSnappedToMeCounter: function() {
			return this.get("pieceIdsSnappedToMe").length;
		},

		addPieceIdSnappedToMe: function(pieceId) {
			// add the piece ID to the pieceIdsSnappedToMe array
			this.get("pieceIdsSnappedToMe").push(pieceId);
			// then save this to the backend storage/db
			// (which is optional in this prototype application)
			this.save();
		},

		removePieceIdSnappedToMe: function(pieceId) {
			// to remove the ID, we'll splice the array at the index of the pieceId
			this.get("pieceIdsSnappedToMe").splice(
				this.attributes.pieceIdsSnappedToMe.indexOf(pieceId), 1);
			// then save this to the backend storage/db
			// (which is optional in this prototype application)
			this.save();
		},

		clearPieceIdsSnappedToMe: function() {
			// this is an all in one call, save the data while clearing the array
			this.save({
				pieceIdsSnappedToMe: []
			});
		}

	});

});

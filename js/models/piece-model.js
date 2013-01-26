var puzzle = puzzle || {};

$(function() {
	'use strict';

	puzzle.PieceModel = Backbone.Model.extend({

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
				topClass: "",
				leftValue: 0,
				leftClass: "",
				rightValue: 0,
				rightClass: "",
				bottomValue: 0,
				bottomClass: "",
				pieceIdsSnappedToMe: []
			};
		},

		initialize: function() {
			switch (this.get("topValue")) {
				case 1:
					this.set("topClass", "bottom-circle");
					break;
				case 2:
					this.set("topClass", "bottom-diamond");
					break;
				case 3:
					this.set("topClass", "bottom-square");
					break;
				case 4:
					this.set("topClass", "bottom-octogon");
					break;
			}
			switch (this.get("bottomValue")) {
				case 1:
					this.set("bottomClass", "top-circle");
					break;
				case 2:
					this.set("bottomClass", "top-diamond");
					break;
				case 3:
					this.set("bottomClass", "top-square");
					break;
				case 4:
					this.set("bottomClass", "top-octogon");
					break;
			}
			switch (this.get("leftValue")) {
				case 1:
					this.set("leftClass", "right-circle");
					break;
				case 2:
					this.set("leftClass", "right-diamond");
					break;
				case 3:
					this.set("leftClass", "right-square");
					break;
				case 4:
					this.set("leftClass", "right-octogon");
					break;
			}
			switch (this.get("rightValue")) {
				case 1:
					this.set("rightClass", "left-circle");
					break;
				case 2:
					this.set("rightClass", "left-diamond");
					break;
				case 3:
					this.set("rightClass", "left-square");
					break;
				case 4:
					this.set("rightClass", "left-octogon");
					break;
			}
		},

		// in order to use save() in the methods below, we must either
		// configure our model/collection to have a backend storage through
		// REST APIs, or configure local storage. Neither are really needed
		// for this application since the state is not intended to be
		// preserved, so we won't use local storage here.
		//localStorage: new Store("Puzzle"),

		getSnappedToMeCounter: function() {
			if (this.get("pieceIdsSnappedToMe")) {
				return this.get("pieceIdsSnappedToMe").length;
			} else {
				return 0;
			}
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

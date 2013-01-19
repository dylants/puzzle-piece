var puzzle = puzzle || {};

$(function( $ ) {
	'use strict';

	puzzle.PieceView = Backbone.View.extend({

		tagName: 'span',

		className: 'piece',

		template: _.template( $('#piece-template').html() ),

		events: {
		},

		initialize: function() {
			this.model.on( 'change', this.render, this );
			this.model.on( 'destroy', this.remove, this );
		},

		render: function() {
			$(this.el).html( this.template( this.model.toJSON() ) );
			$(this.el).attr('id', this.model.get("id"));
			return this;
		}

	});
});
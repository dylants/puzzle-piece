var app = app || {};

$(function( $ ) {
	'use strict';

	app.PieceView = Backbone.View.extend({

		tagName: 'span',

		className: 'piece well',//'span1 well',

		template: _.template( $('#piece-template').html() ),

		events: {
		},

		initialize: function() {
			this.model.on( 'change', this.render, this );
			this.model.on( 'destroy', this.remove, this );
		},

		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}

	});
});
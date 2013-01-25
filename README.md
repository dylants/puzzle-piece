# Puzzle Piece #
A puzzle game where you must match pieces of a puzzle together to form a square.  

## Overview ##

Each piece contains four numbers on it, either positive or negative.  The puzzle pieces
"fit" together when the numbers on the sides of the two pieces, when added together, equal zero.
So for example when a piece with a side of 3 is put against a piece with a side of -3, they fit.
However a side of 3 and a side of 2 would not fit together.  This same logic applies to all sides
of all pieces.  The goal is to put the pieces together to form a square (with 9 pieces shown,
making a 3x3 square would win the game).  The flippers and spinners can be used to rotate each
piece so that it better fits in the puzzle if desired.

## Technical Implementation Details ##

This JavaScript game was built with Backbone.js at it's core, handling the model/view for each
individual piece, along with an overall puzzle view which initially is responsible for building
the game board and each puzzle piece.  With that said, most of the logic lies outside of that
and within the puzzle.js, puzzle.piece.js, and puzzle.flipper.js files.  The core logic is contained
within the puzzle.js file for determining if you've won and the initial pieces of the puzzle.  The
puzzle.piece.js file contains all the logic for making sure a piece fits, and puzzle.flipper.js
contains the logic around flipping and spinning a puzzle piece.

jQuery UI was used to drag and drop each puzzle piece, along with some simple animations.  The
Touch Punch library was added to allow for mobile devices.  The "audio" element from HTML5 was
used to add some sound effects when pieces fit or don't fit together.  Finally, less is used
(lazily) on each load to compile the CSS for the page (instead of pre-compiling on the server).

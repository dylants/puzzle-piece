# Puzzle Piece #
A puzzle game where you must match pieces of a puzzle together to form a square.  

## Overview ##

A puzzle game where you must put the pieces together to form a square.  The game currently
features 9 puzzle pieces which would require a 3x3 square.  The pieces have unique colored
shapes on them, and fit together when these "half-shapes" are matched to form a whole shape.
The flippers and spinners can be used to rotate each piece so that it better fits in the
puzzle (if needed).

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
used to add some sound effects when pieces fit or don't fit together.  Finally, LESS is used
(lazily) on each load to compile the CSS for the page (instead of pre-compiling on the server).

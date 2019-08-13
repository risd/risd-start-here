global.jQuery = $ = require("jquery");

var nav = require( './nav.js' )()
var hero = require( './hero.js' )( onLoad )

// $( window ).on( 'load', onLoad )

function onLoad () {
  console.log( 'loaded callback' )
  // hero.animate()
  $content = $( '.content' )
  $( '.content' ).load( '/content.html-partial', function () {
    $content.addClass( 'show' )
  } )
}

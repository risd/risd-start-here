global.jQuery = $ = require("jquery");

var nav = require( './nav.js' )()
var hero = require( './hero.js' )( onHeroLoad )

function onHeroLoad () {
  $content = $( '.content' )
  $( '.content' ).load( '/content.html-partial', function () {
    $content.addClass( 'show' )
  } )
}

global.jQuery = $ = require("jquery");

var nav = require( './nav.js' )()
var hero = require( './hero.js' )( onHeroLoad )

function onHeroLoad ( $hero ) {
  // load the content
  // swap in content images & embeds
  // then slide up the first section
  $.get( '/content.html-partial', function ( domString ) {
    $( document.body ).append( domString )
    $( document.body ).ready( slideUp.bind( { el: 'doc'} ) )
    $( window ).on( 'load', slideUp.bind( { el: 'win'} ) )
    
  } )

  function slideUp () {
    console.log( 'slide-up' )
    console.log( this.el )
    var toSlide = $hero.next( 'section' )
    console.log( toSlide.get( 0 ) )
    toSlide.addClass( 'slide-up' )
  }
}

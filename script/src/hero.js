var $ = global.jQuery;
var lineSVGHeight = require( '../../swig/line-svg.js' ).lineSVGHeight

module.exports = Hero;

function Hero(opts) {
  if (!(this instanceof Hero)) {
    return new Hero(opts);
  }

  var $hero = $( '.hero' )
  var $text = $( '.hero__text-container' )

  // set the initial position of the hero text,
  // so that it can slide in from a consistent position
  // relative to the screen size
  var textTransformYStart = ( $hero.outerHeight() - $text.outerHeight() ) / 2 + $text.outerHeight() + lineSVGHeight

  var text = $text.get( 0 )

  var textTransition = text.style.transition;
  text.style.transition = '';

  text
    .style
    .setProperty( '--transform-start', `translate(0, ${ textTransformYStart }px) rotate(0deg)` )

  text.style.transition = textTransition;

  $hero.addClass( 'show' )
}

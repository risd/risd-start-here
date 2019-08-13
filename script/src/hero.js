var $ = global.jQuery;
var Player = require( '@vimeo/player' )
var lineSVGHeight = require( '../../swig/line-svg.js' ).lineSVGHeight

module.exports = Hero;

function Hero(opts, onLoadHandler) {
  if (!(this instanceof Hero)) {
    return new Hero(opts, onLoadHandler);
  }

  if ( typeof opts === 'function' ) {
    onLoadHandler = opts
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

  var iframe = document.querySelector( 'iframe' )
  var player = new Player( iframe )
  
  // on play will still buffer with all the instagram requests
  // player.on( 'play', videoLoaded )
  
  player.on( 'progress', checkProgress )

  function checkProgress ( progress ) {
    if ( progress.percent === 1 ) {
      player.off( 'progress', checkProgress )
      videoLoaded()
    }
  }

  function videoLoaded () {
    setTimeout( delayedShow, 1800 )
  }

  function delayedShow () {
    $hero.addClass( 'show' )
    onLoadHandler( $hero )
  }
}

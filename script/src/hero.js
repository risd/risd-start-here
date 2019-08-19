var $ = global.jQuery;
var EventEmitter = require( 'events' )
var Player = require( '@vimeo/player' )
var cssTimeToMS = require( './css-time-to-ms.js' )
var lineSVGHeight = require( '../../swig/line-svg.js' ).lineSVGHeight

module.exports = Hero;

function Hero(opts, loadedHandler) {
  if (!(this instanceof Hero)) {
    return new Hero(opts, loadedHandler);
  }

  if ( typeof opts === 'function' ) loadedHandler = opts
  if ( ! opts ) opts = {}

  var loadVideo = typeof opts.loadVideo === 'boolean'
    ? opts.loadVideo
    : true

  var $hero = $( '.hero' )
  var $text = $( '.hero__text-container' )
  var emitter = new EventEmitter()
  var hero = $hero.get( 0 )

  var showDelay = cssTimeToMS(
    getComputedStyle( hero )
      .getPropertyValue( '--transition-duration' ), 0 )

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

  if ( loadVideo ) {
    var iframe = $hero.find( 'iframe' ).get( 0 )
    var player = new Player( iframe )  

    player.on( 'progress', checkProgress )
  }
  else {
    $hero.find( 'iframe' ).remove()
    loadedHandler()
  }

  return {
    $selector: $hero,
    emitter: emitter,
  }

  function checkProgress ( progress ) {
    if ( progress.percent === 1 ) {
      player.off( 'progress', checkProgress )
      loaded()
      loadedHandler()
    }
  }

  function loaded () {
    emitter.emit( 'loaded' )
    setTimeout( delayedShow, showDelay )
  }

  function delayedShow () {
    $hero.addClass( 'show' )
  }
}

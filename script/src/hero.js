var $ = global.jQuery;

module.exports = Hero;

function Hero(opts) {
  if (!(this instanceof Hero)) {
    return new Hero(opts);
  }

  var animationTimeout = opts.animationTimeout || 3000

  var $hero = $( '.hero' )
  var $text = $( '.hero__title' )

  $text
    .get( 0 )
    .style
    .setProperty( '--transform-start', `translate(0, ${ $hero.outerHeight() }px) rotate(0deg)` )

  setTimeout( show, animationTimeout )

  function show () {
    $hero.addClass( 'show' )
  }
}

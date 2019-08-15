global.jQuery = window.jQuery = $ = require("jquery");

$( window ).scrollTop( 0 )

window.addEventListener( 'message', onContentLoadedMessage )

var lines = require( './line-svg.js' )

var nav = require( './nav.js' )()

var hero = require( './hero.js' )( onHeroLoad )

// this gets defined in the `onHeroLoad` handler
// and set to the scope of this script to be used
// in other functions.
var $sharedHero;
function onHeroLoad ( $hero ) {
  $sharedHero = $hero;
  // load the content
  // swap in content images & embeds
  // then slide up the first section
  $.get( '/content.html-partial', function ( domString ) {
    // domString includes a `content.js` script that
    // posts message of `content-loaded` that is listened
    // for by this bundle
    console.log( 'append::domString' )
    $( document.body ).append( domString )
  } )
}

function onContentLoadedMessage ( msg ) {
  if ( msg.data === 'start-here::content-loaded' ) {
    lines( {
      selector: '.line-svg',
      groupBy: 'data-line-id',
    } )
    // sectionNav.extractHashes().recalculate().setActive()
    slideUp()
    nav.addEventListeners()
  }
}

function slideUp () {
  console.log( 'slide-up' )
  var $toSlide = $sharedHero.siblings( 'section' ).first()
  var toSlide = $toSlide.get( 0 )

  if ( ! toSlide ) {
    console.log( 'hero-siblings' )
    console.log( $sharedHero.siblings() )
    return
  }

  console.log( 'slide-up:transition-listener' )
  // toSlide.addEventListener( 'transitionend', slideEnd )

  $toSlide.addClass( 'slide-up' )
  $.get( '/content-scripts.html-partial', function ( scriptsString ) {
    console.log( 'append::scriptsString' )
    $( document.body ).append( scriptsString )
    hydrate()  
  } )

  // function slideEnd () {
  //   console.log( 'transition-end' )
  //   toSlide.removeEventListener( 'transitionend', slideEnd )
  // }
}

function hydrate () {
  console.log( 'hydrate' )

  $( 'a[data-lazy-load-type="img"]' ).each( swapSrcForImg )
  $( 'div[data-lazy-load-type="iframe"]' ).each( swapSrcForIframe )

  function swapSrcForImg ( index, anchor ) {
    var src = anchor.dataset.lazyLoadSrc
    $( anchor ).append( imgForSrc( src ) )
  }

  function swapSrcForIframe ( index, div ) {
    var src = div.dataset.lazyLoadSrc
    $( div ).replaceWith( iframeForSrc( src ) )
  }

  function imgForSrc ( src ) {
    return `<img src="${ src }" alt="" />`
  }

  function iframeForSrc ( src ) {
    return `<iframe
      class="instagram-media instagram-media-rendered"
      id="instagram-embed-0"
      src="${ src }"
      allowtransparency="true"
      allowfullscreen="true"
      frameborder="0"
      height="831"
      data-instgrm-payload-id="instagram-media-payload-0"
      scrolling="no"
      style="background: white; max-width: 540px; width: calc(100% - 2px); border-radius: 3px; border-width: 1px; border-style: solid; border-color: rgb(219, 219, 219); box-shadow: none; margin-right: 0px; margin-bottom: 12px; margin-left: 0px; min-width: 326px;">
    </iframe>`
  }
}
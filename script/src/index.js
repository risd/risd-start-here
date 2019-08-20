global.jQuery = window.jQuery = $ = require("jquery");

$( window ).scrollTop( 0 )

window.addEventListener( 'message', messageHandler )

var lines = require( './line-svg.js' )

var nav = require( './nav.js' )()

var hydrate = Hydrate()

var loadVideo = ! Modernizr.touch
var hero = require( './hero.js' )( { loadVideo: loadVideo } )

if ( loadVideo ) {
  hero.emitter.on( 'loaded', function videoLoaded () {
    hydrate.video()
  } )  
}
else {
  hydrate.video()
}


getContent()

function getContent () {
  console.log( 'get-content' )
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

function messageHandler ( msg ) {
  if ( event.origin !== window.location.origin ) return
  // sent from the bottom of the content.hmtl-partial
  if ( msg.data === 'start-here::content-loaded' ) {
    lines( {
      selector: '.line-svg',
      groupBy: 'data-line-id',
    } )
    slideUp()
    nav.addEventListeners()
    getContentScripts()
  }
  // sent from the content script
  if ( msg.data === 'start-here::document-size-changed' ) {
    nav.recalculateSections()
  }
}

function slideUp () {
  console.log( 'slide-up' )
  var $toSlide = hero.$selector.siblings( 'section' ).first()
  var toSlide = $toSlide.get( 0 )

  // console.log( 'slide-up:transition-listener' )
  // toSlide.addEventListener( 'transitionend', slideEnd )

  $toSlide.addClass( 'slide-up' )

  // function slideEnd () {
  //   console.log( 'transition-end' )
  //   toSlide.removeEventListener( 'transitionend', slideEnd )
  // }
}

function getContentScripts () {
  $.get( '/content-scripts.html-partial', function ( scriptsString ) {
    console.log( 'append::scriptsString' )
    $( document.body ).append( scriptsString )
    hydrate.contentScript()
  } )
}

function Hydrate () {
  var hasLoaded = {
    video: false,
    contentScript: false,
  }

  return {
    contentScript: function () {
      hasLoaded.contentScript = true
      if ( hasLoaded.video ) hydrateImages()
    },
    video: function () {
      hasLoaded.video = true
      if ( hasLoaded.contentScript ) hydrateImages()
    },
  }
}

function hydrateImages () {
  console.log( 'hydrate-images' )

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
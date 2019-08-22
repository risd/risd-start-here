var $ = global.jQuery;
var url = require( 'url' )
var SectionNav = require( './section-nav' )
var lineHeight = require( '../../swig/line-svg.js' ).lineSVGHeight
var cssTimeToMS = require( './css-time-to-ms.js' )

module.exports = Nav;

function Nav(opts) {
  if (!(this instanceof Nav)) {
    return new Nav(opts);
  }

  var selector = '.nav'
  var targetSelector = '.nav__current'
  var displayClass = 'show'
  var linkTarget = 'a'
  var closeTarget = '.nav__close'
  var textSelector = '.nav__text'

  var $selector = $( selector )
  var $target = $selector.find( targetSelector )
  var $links = $selector.find( 'a' )
  var $closeTarget = $selector.find( closeTarget )
  var $textSelector = $selector.find( textSelector )
  var offset = navHeight;
  var sectionNav = SectionNav( {
    selector: selector,
    activeClass: 'is-active',
    offset: function () { return navHeight() + lineHeight  },
  } )
  
  sectionNav.emitter.on( 'new-section', function ( $selected ) {
    $textSelector.html( $selected.html() )
    $textSelector.attr( 'data-nav-url', $selected.parent().attr( 'data-nav-url' ) )
    $textSelector.attr( 'data-nav-type', $selected.parent().attr( 'data-nav-type' ) )
  } )

  var self = {
    height: navHeight,
    close: close,
    addEventListeners: init,
    recalculateSections: function () {
      sectionNav.extractHashes().recalculate().setActive()
    },
  }

  return self;

  function init () {
    $target.on( 'click', function ( event ) {
      $selector.toggleClass( displayClass );
    } )

    $links.on( 'click', handleLinkClick )

    $closeTarget.on( 'click', close )
  }

  function navHeight () {
    return $selector.outerHeight()
  }

  function close () {
    $selector.removeClass( displayClass )
  }

  function handleLinkClick ( event ) {
    event.preventDefault()

    if ( event.target.href ) {
      var hrefString = event.target.href
      var targetString = event.target.target
    }
    else {
      var hrefString = $( event.target ).closest( 'a' ).attr( 'href' )
      var targetString = $( event.target ).closest( 'a' ).attr( 'target' )
    }

    if ( ! hrefString  ) return

    if ( hrefString.startsWith( '#' ) ) {
      var hrefString = `${ window.location.protocol }//${ window.location.host }${ window.location.pathname }${ hrefString }`
    }
    
    var href = url.parse( hrefString )
    if ( href.host === window.location.host &&
         href.pathname === window.location.pathname &&
         href.hash &&
         href.hash.length > 0 ) {
      var anchorId = href.hash.slice( 1 )
    }
    else {
      return window.open( hrefString, targetString ? targetString : '' )
    }

    if ( ! anchorId ) return

    close()

    var $anchor = $( `[id="${ anchorId }"]` )
    var $section = $anchor.closest( 'section' )

    if ( $section.is( 'section' ) ) {
      var $scrollTo = $section
    }
    else {
      var $scrollTo = $anchor
    }
      
    // if ( $section &&
    //      $section.hasClass( 'question-container' ) &&
    //      ! $section.hasClass( 'show' ) ) {
    //   $section.trigger( 'click' )
    // }

    var duration = cssTimeToMS(
      getComputedStyle( $scrollTo.get( 0 ) )
        .getPropertyValue( '--transition-duration' ) )

    $( 'html,body' )
      .animate( {
        scrollTop: $scrollTo.offset().top,
      }, duration, doneAnimating )

    function doneAnimating () {
      history.pushState( null, null, `#${ anchorId }` )
    }
  }
}

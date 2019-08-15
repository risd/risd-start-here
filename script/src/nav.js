var $ = global.jQuery;
var url = require( 'url' )
var SectionNav = require( './section-nav' )

module.exports = Nav;

function Nav(opts) {
  if (!(this instanceof Nav)) {
    return new Nav(opts);
  }

  var selector = '.nav'
  var targetSelector = '.nav__current'
  var displayClass = 'show'
  var linkTarget = 'a'

  var $selector = $( selector )
  var $target = $selector.find( targetSelector )
  var $links = $selector.find( 'a' )
  var offset = navHeight;
  var sectionNav = SectionNav( {
    selector: selector,
    activeClass: 'is-active',
    offset: function twoHeight() { return navHeight() * 2 },
  } )

  return {
    height: navHeight,
    close: close,
    addEventListeners: init,
  }

  function init () {
    sectionNav.extractHashes().recalculate().setActive()

    $target.on( 'click', function ( event ) {
      $selector.toggleClass( displayClass );
    } )

    $links.on( 'click', handleLinkClick )
  }

  function navHeight () {
    return $selector.outerHeight()
  }

  function close () {
    $selector.removeClass( displayClass )
  }

  function handleLinkClick ( event ) {
    event.preventDefault()

    var href = url.parse( event.target.href )
    if ( href.host === window.location.host &&
         href.pathname === window.location.pathname &&
         href.hash &&
         href.hash.length > 0 ) {
      var anchorId = href.hash.slice( 1 )
    }
    else {
      return window.open( event.target.href, event.target.target ? event.target.target : '' )
    }

    if ( ! anchorId ) return

    close()

    var $anchor = $( `[id="${ anchorId }"]` )
    var $section = $anchor.parents( 'section' )

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

    $( 'html,body' )
      .animate( {
        scrollTop: $scrollTo.offset().top - offset(),
      }, doneAnimating )

    function doneAnimating () {
      history.pushState( null, null, `#${ anchorId }` )
    }
  }
}

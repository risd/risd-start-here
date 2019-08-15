var $ = global.jQuery;
var url = require( 'url' )

module.exports = NavClickHandler;

function NavClickHandler( opts ) {
  if (!(this instanceof NavClickHandler)) {
    return new NavClickHandler(opts);
  }

  if ( ! opts ) opts = {}
  if ( typeof opts.offset === 'function' ) {
    var offset = opts.offset
  }
  if ( typeof opts.offset === 'number' ) {
    var offset = function () { return opts.offset }
  }
  else {
    var offset = function () { return 0 }
  }

  return handleLinkClick

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

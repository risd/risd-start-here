var $ = global.jQuery;

var { hydrateComponents } = require('@risd/react-hydrator');
var { themes } = require('@risd/ui');

module.exports = Nav;

function Nav(opts) {
  if (!(this instanceof Nav)) {
    return new Nav(opts);
  }

  var selector = '[data-react-component="Nav"]'
  var $selector = $( selector )
  
  // Hydrate React components
  hydrateComponents( themes.startHere )

  // unhide nav element once it's hydrated
  var navElement = document.querySelector( selector );
  navElement.style.display = 'block';

  var $header = $selector.children( 'header' )

  $selector
    .find( 'a' )
    .click( handleLinkClick )

  function navHeight () {
    return $header.outerHeight()
  }

  function handleLinkClick ( event ) {
    event.preventDefault()

    var anchorId = anchorFromURL( event.target.href )
    if ( ! anchorId ) return

    var $anchor = $( `[id="${ anchorId }"]` )
    var $section = $anchor.parents( 'section' )
      
    if ( $section &&
         $section.hasClass( 'question-container' ) &&
         ! $section.hasClass( 'show' ) ) {
      $section.trigger( 'click' )
    }

    if ( $section ) {
      var $scrollTo = $section
    }
    else {
      var $scrollTo = $anchor
    }

    $( 'html,body' )
      .animate( {
        scrollTop: $scrollTo.offset().top - navHeight(),
      }, doneAnimating )

    function doneAnimating () {
      history.pushState( null, null, `#${ anchorId }` )
    }
  }
}

function anchorFromURL ( url ) {

  return stripString( url, [
    window.location.protocol,
    '//',
    window.location.host,
    ':',
    window.location.port,
    '/',
    '#',
  ] )
}

function stripString ( str, remove ) {
  if ( ! Array.isArray( remove ) ) remove = [ remove ]

  remove.forEach( strip )

  return str

  function strip ( removeStr ) {
    var start = str.indexOf( removeStr )
    if ( start === -1 ) return

    str = str.slice( 0, start ) + str.slice( start + removeStr.length )
  }
}

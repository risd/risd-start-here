var $ = global.jQuery;
var url = require( 'url' )
var EventEmitter = require( 'events' )
var debounce = require( 'debounce' )

module.exports = SectionNav;

function SectionNav(opts) {
  if (!(this instanceof SectionNav)) {
    return new SectionNav(opts);
  }

  if ( ! opts ) opts = {}

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

  var selector = opts.selector || '.nav-horizontal--top'
  var activeClass = opts.activeClass || 'is-active'

  var $selector = $( selector )

  // targets : [ { hash, parent } ]
  var targets = []
  var $links = $selector.find( 'a' )
  var $title = $selector.find( 'li[data-nav-type="title"] a' )
  var emitter = new EventEmitter()
  var currentHash = null
  var successfully = {
    foundContent: false,
    calculatedTop: false,
  }

  extractHashes()
  recalculateTargets()

  $( window ).on( 'scroll', debounce( setActive, 20, true ) )

  $( window ).resize( recalculateTargets )

  var self = {
    height: height,
    recalculate: recalculateTargets,
    setActive: setActive,
    extractHashes: extractHashes,
    emitter: emitter,
  }

  return self

  function height () {
    return $selector.outerHeight()
  }

  function extractHashes () {
    targets = []
    $links.each( extractHashesFromLinks )
    return self;
  }
  
  function extractHashesFromLinks ( index, anchor ) {
    var href = url.parse( anchor.href )
    if ( ! href.hash ) return;

    var hash = href.hash;

    var $content = $( hash )

    if ( $content.get( 0 ) ) {
      successfully.foundContent = true
    }

    targets = targets.concat( [ {
      hash: hash,
      $nav: $( anchor ),
      $content: $content,
      top: top,
    } ] )
  }

  function recalculateTargets () {
    targets = targets.map( function ( target ) {
      var $content = target.$content;

      if ( $content.get( 0 ) ) {
        var top = $content.offset().top
        successfully.calculatedTop = true
      } else {
        var top = null
      }

      target.top = top
      return target
    } )
    return self;
  }

  function setActive ( event ) {
    if ( successfully.foundContent === false ) extractHashes()
    recalculateTargets()
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop
    scrollTop = scrollTop + offset() + 50
    var possibleHash = null;
    targets.forEach( function ( target ) {
      if ( target.top && target.top < scrollTop ) {
        possibleHash = target.hash;
      }
    } )
    if ( currentHash !== possibleHash ||
         possibleHash === null ) {
      $links.removeClass( activeClass )
    }
    if ( currentHash === null ||
         currentHash !== possibleHash ) {
       targets
        .filter( function ( target ) { return target.hash === possibleHash } )
        .forEach( function ( target ) {
          target.$nav.addClass( activeClass )
          emitter.emit( 'new-section', target.$nav )
        } )
    }
    if ( possibleHash === null ) {
      history.replaceState( null, '', $title.data( 'data-nav-url' ) )
      emitter.emit( 'new-section', $title )
    }
    else {
      history.replaceState( null, '', possibleHash )
    }
    currentHash = possibleHash;
    return self;
  }
}

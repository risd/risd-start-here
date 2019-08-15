var $ = global.jQuery;
var url = require( 'url' )

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

  var selector = '.nav-horizontal--top'
  var activeClass = 'is-active'
  var $selector = $( selector )

  // targets : [ { hash, parent } ]
  var targets = []
  var $links = $selector.find( 'a' )
  var currentHash = null;

  $links.each( extractHashes )

  recalculateTargets()

  $( window ).on( 'scroll', setActive )

  $( window ).resize( recalculateTargets )

  var self = {
    height: height,
    recalculate: recalculateTargets,
    setActive: setActive,
    extractHashes: function () {
      targets = []
      $links.each( extractHashes )
      return self;
    }
  }

  return self

  function height () {
    return $selector.outerHeight()
  }
  
  function extractHashes ( index, anchor ) {
    var href = url.parse( anchor.href )
    if ( ! href.hash ) return;

    var hash = href.hash;

    var $content = $( hash )

    if ( $content.get( 0 ) ) {
      var top = $content.offset().top
    } else {
      var top = null
    }

    targets = targets.concat( [ {
      hash: hash,
      $nav: $( anchor ),
      $content: $content,
      top: top,
    } ] )
  }

  function recalculateTargets () {
    targets.map( function ( target ) {
      var $content = target.$content;

      if ( $content.get( 0 ) ) {
        var top = $content.offset().top
      } else {
        var top = null
      }

      target.top = top
      return target
    } )
    return self;
  }

  function setActive ( event ) {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop
    scrollTop = scrollTop + offset() + 10
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
        .forEach( function ( target ) { target.$nav.addClass( activeClass ) } )
    }
    currentHash = possibleHash;
    return self;
  }
}

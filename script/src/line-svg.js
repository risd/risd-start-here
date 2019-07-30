var $ = global.jQuery;
var lib = require( '../../swig/line-svg.js' )

module.exports = LineSVG;

function LineSVG ( options ) {
  if ( ! ( this instanceof LineSVG ) ) return new LineSVG( options )

  if ( ! options ) options = {}

  var selector = options.selector || '.line-svg'

  resize()
  $( window ).on( 'resize', resize )

  function resize () {
    $( selector ).each( updateSVGs )  
  }
}

function updateSVGs ( index, svg ) {
  var $svg = $( svg )
  
  var points = lib.lineSVGPoints( {
    width: svgWidth(),
  } )

  $svg.children( 'polyline' ).each( updatePolyline( points ) )
  $svg.find( 'polygon' ).each( updatePolygons( points ) )
}

function updatePolyline ( points ) {
  return function updatePolylineWithPoints ( index, polyline ) {
    $( polyline ).attr( 'points', points )
  }
}

function updatePolygons ( points ) {
  return function updatePolygonsWithPoints ( index, polygon ) {
    var $polygon = $( polygon )
    var updateFunction = $polygon
      .attr( 'points' )
      .endsWith( '0,0' ) // the top polygon clip path ends in at the origin
      ? lib.lineSVGAboveClipPoints
      : lib.lineSVGBelowClipPoints

    $polygon.attr( 'points', updateFunction( {
      width: svgWidth(),
      height: lib.lineSVGHeight,
      points: points,
    } ) )
  }
}

function svgWidth () {
  return window.innerWidth + lib.lineSVGStrokeWidth * 2
}

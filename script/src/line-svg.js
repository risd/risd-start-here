var $ = global.jQuery;
var lib = require( '../../swig/line-svg.js' )

module.exports = LineSVG;

/**
 * LineSVG is responsible for setting the points
 * for both the `polyline` and `rect` elements that
 * make up the LineSVG breaks.
 *
 * Markup that is being manipulated is in:
 * templates/partials/components/line-top.swig
 * templates/partials/components/line-bottom.swig
 * 
 * @param {object} options
 * @param {string} options.selector
 */
function LineSVG ( options ) {
  if ( ! ( this instanceof LineSVG ) ) return new LineSVG( options )

  if ( ! options ) options = {}

  var selector = options.selector || '.line-svg'
  var groupBy = options.groupBy || 'data-line-id'

  var lineSelectors = $( selector )
    .map( mapUnique( groupBy ) )
    .filter( filterValue( null ) )
    .get()
    .map( makeQuerySelectorFor( { type: 'svg', attribute: groupBy } ) )

  redraw()
  $( window ).on( 'resize', redraw )

  // redraw the svg lines that are initialized by the static template
  function redraw () {
    lineSelectors.forEach( updateLineSelector ) 
  }
}

// uniqueAttribute => [ index, element ] => [ lineId | null ]
function mapUnique ( uniqueAttribute ) {
  var unique = []
  return function map ( index, element ) {
    var value = $( element ).attr( uniqueAttribute )
    if ( unique.indexOf( value ) === -1 ) {
      unique = unique.concat( [ value ] )
      return value;
    }
    else {
      return null;
    }
  }
}

// removeValue => [ checkValue ] => [ keptValue ]
function filterValue ( removeValue ) {
  return function filter ( checkValue ) {
    return checkValue !== removeValue
  }
}

// querySpec : { type, attribute } => [ attributeValue ] => [ querySelector ]
function makeQuerySelectorFor ( querySpec ) {
  var type = querySpec.type
  var attributeName = querySpec.attribute
  return function make ( attributeValue ) {
    return `${ type }[${ attributeName }="${ attributeValue }"]`
  }
}

// [ line : { id, $selector } ] => { lineId: line$selector }
function lineIdSelectorObjById ( lines, currentLine ) {
  return lines[ currentLine.id ] = currentLine.$selector
}

function updateLineSelector ( lineSelector ) {
  var points = lib.lineSVGPoints( {
    width: svgWidth(),
  } )
  $( lineSelector ).each( updatePointsWith( points ) )
}

function updatePointsWith ( points ) {
  return function updatePoints ( index, svg ) {
    var $svg = $( svg )

    $svg.children( 'polyline' ).each( updatePolyline( points ) )
    $svg.find( 'polygon' ).each( updatePolygons( points ) )
  }

  function updatePolyline ( points ) {
    return function updatePolylineWithPoints ( index, polyline ) {
      $( polyline ).attr( 'points', points )
    }
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

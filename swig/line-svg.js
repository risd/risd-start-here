var width = 1200;
var height = 80;
var strokeWidth = 20;

module.exports = {
  lineSVGPoints: lineSVGPoints,
  lineSVGAboveClipPoints: lineSVGAboveClipPoints,
  lineSVGBelowClipPoints: lineSVGBelowClipPoints,
  lineSVGWidth: width,
  lineSVGHeight: height,
  lineSVGStrokeWidth: strokeWidth,
}

function lineSVGPoints ( options ) {
  if ( ! options ) options = {}

  width = options.width || width;
  height = options.height || height;
  strokeWidth = options.strokeWidth || strokeWidth;

  var walked = -( strokeWidth )
  var points = [ [ walked, randomVerticalPoint() ] ]

  var distanceToTravel = width;

  while( walked < distanceToTravel ) {

    var walkDistance = randomInt(distanceToTravel)

    if ( walkDistance + walked > distanceToTravel ) {
      walkDistance = distanceToTravel - walked
    }

    walked = walked + walkDistance
    
    points = points.concat( [ [ walked, randomVerticalPoint() ] ] )
  }

  return points.map( arrayToString ).join( ' ' )

  function arrayToString ( arr ) {
    return arr.join( ',' )
  }
}

function lineSVGAboveClipPoints ( options ) {
  var points = options.points
  width = options.width || width
  return `${ points } ${ width },0 0,0`
}

function lineSVGBelowClipPoints ( options ) {
  var points = options.points
  width = options.width || width
  height = options.height || height
  return `${ points } ${ width },${ height } 0,${ height }`
}

function randomVerticalPoint () {
  return randomInt( strokeWidth / 2, height - ( strokeWidth / 2 ) )
}

function randomInt ( min, max ) {
  if ( ! arguments.length ) min = 0, max = 1
  if ( arguments.length === 1 ) max = min, min = 0
  var range = max - min
  return Math.floor( min + range * Math.random() )
}

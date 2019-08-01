var cheerio = require('cheerio')
var count = 0

module.exports = {
  rollup_galleries: rollup_galleries,
}

/*

rollup_galleries accepts wysiwyg html
as input, and rolls up consective
top level `figure` elements into
slider galleries

<p></p>
<p></p>
<h3></h3>
<figure></figure> - data-slider-0
<figure></figure> - data-slider-0
<figure></figure> - data-slider-0
<h3></h3>
<p></p>
<figure></figure> - data-slider-1
<figure></figure> - data-slider-1
<figure></figure> - data-slider-1
<p></p>

 */

function rollup_galleries ( input ) {
  // ensure we are using the layout bug free version of the instagram embed
  // input = input.replace( /www.instagram.com\/embed.js/g, 'platform.instagram.com/en_US/embeds.js' )
  
  // roll up sliders
  var parseRootId = 'parse-root'
  var trackingAttr = 'data-slider'
  var $ = cheerio.load( `<div id=${parseRootId}>${ input }</div>` )
  
  var parseRootQuery = `div#${parseRootId}`
  var nodes = $( parseRootQuery ).children()

  // keep track of status of sliders
  var slider = {
    counter: -1,   // tracks total number of sliders
    start: false,  // index of current sliders start figure
    end: false,    // index of current sliders end figure
    previous: { name: false },
  }

  // add data-slider attributes
  nodes.each( function ( index, element ) {
    if ( slider.previous.name === 'figure' &&
         element.name === 'figure' &&
         typeof slider.start === 'number' ) {
      // in a slider
      $( element ).attr( trackingAttr, slider.counter )
    }
    else if ( slider.previous.name === 'figure' &&
              element.name === 'figure' &&
              slider.start === false ) {
      // start of slider found
      slider.counter += 1
      slider.start = index - 1

      $( element ).attr( trackingAttr, slider.counter )
      $( slider.previous ).attr( trackingAttr, slider.counter )
    }
    else if ( slider.previous.name === 'figure' &&
              element.name !== 'figure' &&
              slider.start !== false ) {
      // end of slider found
      slider.end = index - 1
      $( slider.previous ).attr( trackingAttr, slider.counter )

      // reset
      slider.start = false
      slider.end = false
    }

    // set the current element as our next lookback
    slider.previous = element;
  } )

  // nest sliders within a slider-container
  for (var i = 0; i <= slider.counter; i++) {
    var sliderQuery = `figure[${ trackingAttr }=${ i }]`
    var sliderContents = $( sliderQuery )
    
    // construct slider container
    var firstFigure = $( sliderQuery ).first()
    var sliderContainer = `<ul class="gallery__slider" ${ trackingAttr }=${ i }></ul>`
    $( sliderContainer ).insertBefore( firstFigure )
    // append figures to container
    $( `ul[${ trackingAttr }=${ i }]` ).append( sliderContents )
    // wrap figures in slide li elements
    $( `ul[${ trackingAttr }=${ i }] ${ sliderQuery }` )
      .wrap( $( '<li class="slide"></li>' ) )
    // remove original figures
    $( parseRootQuery ).children( sliderQuery ).remove()
  }

  var output = $( parseRootQuery ).html()

  return output
}

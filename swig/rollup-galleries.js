var cheerio = require('cheerio')
// this is flipped to true if there is an instagram
// embed script that is processed
var insert_instagram_embed =  false
var instagram_embed_url = 'www.instagram.com/embed.js'
// var instagram_embed_url = 'platform.instagram.com/en_US/embeds.js'

module.exports = {
  rollup_galleries: rollup_galleries,
  optional_instagram_embed: optional_instagram_embed,
}

/*

rollup_galleries accepts wysiwyg html
as input, and rolls up consective
top level `figure` elements into
slider galleries

sample input:
<p></p>
<p></p>
<h3></h3>
<figure></figure>
<figure></figure>
<figure></figure>
<h3></h3>
<p></p>
<figure></figure>
<figure></figure>
<figure></figure>
<p></p>


with data-slider attributes:
<p></p>
<p></p>
<h3></h3>
<figure data-slider=0></figure>
<figure data-slider=0></figure>
<figure data-slider=0></figure>
<h3></h3>
<p></p>
<figure data-slider=1></figure>
<figure data-slider=1></figure>
<figure data-slider=1></figure>
<p></p>

wrapped in slider marker:
<p></p>
<p></p>
<h3></h3>
<ul class="gallery__slider" data-slider=0>
  <li class="slide">
    <figure data-slider=0></figure>
  </li>
  <li class="slide">
    <figure data-slider=0></figure>
  </li>
  <li class="slide">
    <figure data-slider=0></figure>
  </li>
</ul>
<h3></h3>
<p></p>
<ul class="gallery__slider" data-slider=1>
  <li class="slide">
    <figure data-slider=1></figure>
  </li>
  <li class="slide">
    <figure data-slider=1></figure>
  </li>
  <li class="slide">
    <figure data-slider=1></figure>
  </li>
</ul>
<p></p>


 */

function rollup_galleries ( input ) {
  // ensure we are using the layout bug free version of the instagram embed
  // input = input.replace( /${ instagram_embed_url.replace( /\//g, '\/' ) }/g, 'platform.instagram.com/en_US/embeds.js' )
  
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

  // nest sliders within their container markup
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

  check_remove_instagram_embed_script( $( parseRootQuery ) )

  var output = $( parseRootQuery ).html()

  return output
}

function check_remove_instagram_embed_script ( $root ) {
  var $scripts = $root.find( `script[src="//${ instagram_embed_url }"]` )
  if ( $scripts.length > 0 ) {
    insert_instagram_embed = true;
    $scripts.remove()
  }
}

function optional_instagram_embed () {
  if ( insert_instagram_embed === false) return ''
  else {
    return `
      <script async src="//${ instagram_embed_url }"></script>`
  }
}

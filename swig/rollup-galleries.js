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

  // replace blockquotes with iframe embeds
  $( parseRootQuery )
    .find( 'blockquote.instagram-media' )
    .parents( 'figure' )
    .each( replaceBlockQuoteWithIframe )

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
    
    // replace instagram embed with image redirect
    var instagramBlockQuoteQuery = `${ sliderQuery } blockquote.instagram-media`
    var instagramIframeQuery = `${ sliderQuery } iframe.instagram-media`

    // $( instagramBlockQuoteQuery )
    //   .parents( sliderQuery )
    //   .each( replaceBlockQuoteWithImage )

    $( instagramIframeQuery )
      .parents( sliderQuery )
      .each( replaceIframeWithImage )

    function replaceBlockQuoteWithImage ( index, figure ) {
      var instagramLink = $( figure )
        .find( instagramBlockQuoteQuery )
        .attr( 'data-instgrm-permalink' )

      var caption = $( figure )
        .find( 'figcaption' )
        .html()

      var image = image_for_instagram( {
        url: instagramLink,
        trackingAttr: trackingAttr,
        trackingValue: i,
        caption: caption,
      } )

      $( figure ).replaceWith( $( image ) )
    }

    function replaceIframeWithImage ( index, figure ) {
      var instagramLink = $( figure )
        .find( instagramIframeQuery )
        .attr( 'src' )
        .split( 'embed' )[ 0 ]

      var caption = $( figure )
        .find( 'figcaption' )
        .html()

      var image = image_for_instagram( {
        url: instagramLink,
        trackingAttr: trackingAttr,
        trackingValue: i,
        caption: caption,
      } )
      
      $( figure ).replaceWith( $( image ) )
    }
  }

  check_remove_instagram_embed_script( $( parseRootQuery ) )

  var output = $( parseRootQuery ).html()

  return output


  function replaceBlockQuoteWithIframe ( index, figure ) {
    var instagramLink = $( figure )
      .find( 'blockquote.instagram-media' )
      .attr( 'data-instgrm-permalink' )

    $( figure ).html( iframe_for_url( instagramLink ) )
  }
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
      <script async src="//${ instagram_embed_url }"></script>`.trim()
  }
}

function image_for_instagram ( options ) {
  var url = options.url
  var trackingAttr = options.trackingAttr
  var trackingValue = options.trackingValue
  var caption = options.caption
  return `
    <figure
      data-type="image"
      class="wy-figure-full"
      ${ trackingAttr }=${ trackingValue }>
      <a href="${ url }" target="_blank">
        <img src="${ url }media/?size=l" alt="" />
      </a>
      ${ caption
          ? `<figcaption>${ caption }</figcaption>`
          : '' }
    </figure>
  `.trim()
}

function iframe_for_url ( url ) {
  return `
    <iframe
      class="instagram-media instagram-media-rendered"
      id="instagram-embed-0"
      src="${ url }embed/captioned/?cr=1&amp;v=12&amp;wp=540&amp;rd=https%3A%2F%2Fstart-here.risd.systems&amp;rp=%2Fcms%2F#%7B%22ci%22%3A0%2C%22os%22%3A22785353.955%7D"
      allowtransparency="true"
      allowfullscreen="true"
      frameborder="0"
      height="831"
      data-instgrm-payload-id="instagram-media-payload-0"
      scrolling="no"
      style="background: white; max-width: 540px; width: calc(100% - 2px); border-radius: 3px; border-width: 1px; border-style: solid; border-color: rgb(219, 219, 219); box-shadow: none; margin-right: 0px; margin-bottom: 12px; margin-left: 0px; min-width: 326px;"></iframe>
    `.trim()
}

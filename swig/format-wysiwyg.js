var cheerio = require('cheerio')
// this is flipped to true if there is an instagram
// embed script that is processed
var insert_instagram_embed =  false
var instagram_embed_url = 'www.instagram.com/embed.js'
// var instagram_embed_url = 'platform.instagram.com/en_US/embeds.js'

module.exports = {
  format_wysiwyg: format_wysiwyg,
  optional_instagram_embed: optional_instagram_embed,
}

/*

format_wysiwyg

accepts wysiwyg html as input
1. rolls up consective top level `figure`
   elements into slider galleries
2. replaces instagrame iframes and embeds with markup
   that gets hydrated in `script/src/index.js`
   this form of lazy loading is done to control when
   all of these assets start being gathered.
3. updates vimeo figure wrappers to include `vimedo-media`
   class, so that its iframe can be repsonsively styled.

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

function format_wysiwyg ( input ) {
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
    var instagramIframeQuery = `${ sliderQuery } iframe.instagram-media`

    $( instagramIframeQuery )
      .parents( sliderQuery )
      .each( replaceIframeWithImage )

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

  // replace iframes with divs to be replaced on load
  $( parseRootQuery )
    .find( 'iframe.instagram-media' )
    .each( replaceIframeWithLazyLoadDiv )

  check_remove_instagram_embed_script( $( parseRootQuery ) )

  // update vimeo iframe parent figure's with `vimeo-media` class
  $( parseRootQuery )
    .find( 'iframe' )
    .each( addVimeoMediaClass )

  var output = $( parseRootQuery ).html()

  return output


  function replaceBlockQuoteWithIframe ( index, figure ) {
    var instagramLink = $( figure )
      .find( 'blockquote.instagram-media' )
      .attr( 'data-instgrm-permalink' )

    $( figure )
      .find( 'blockquote.instagram-media' )
      .replaceWith( iframe_for_url( instagramLink ) )
  }

  function replaceIframeWithLazyLoadDiv ( index, iframe ) {
    var url = $( iframe ).attr( 'src' )
    $( iframe ).replaceWith( iframe_lazy_load_div_for_url( url ) )
  }

  function addVimeoMediaClass ( index, iframe ) {
    var src = $( iframe ).attr( 'src' )
    if ( src.indexOf( 'vimeo' ) === -1 ) return

    if ( ! $( iframe ).hasClass( 'vimeo-media' ) ) {
      $( iframe ).addClass( 'vimeo-media' )
    }

    $( iframe ).wrap( '<div class="vimeo-wrapper"></div>' )
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

  var instagram_post_url = instagram_post_url_for_url( url )
  // early return empty string if no url match is found
  if ( ! instagram_post_url ) return ''

  return `
    <figure
      data-type="image"
      class="wy-figure-full"
      ${ trackingAttr }=${ trackingValue }>
      <a
        href="${ instagram_post_url }"
        target="_blank"
        data-lazy-load-type="img"
        data-lazy-load-src="${ instagram_post_url }media/?size=l">
      </a>
      ${ caption
          ? `<figcaption>${ caption }</figcaption>`
          : '' }
    </figure>
  `.trim()
}

function iframe_for_url ( url ) {
  var instagram_post_url = instagram_post_url_for_url( url )
  // early return empty string if no url match is found
  if ( ! instagram_post_url ) return ''
  return `
    <iframe
        class="instagram-media instagram-media-rendered"
        id="instagram-embed-0"
        src="${ instagram_post_url }embed/captioned/"
        allowtransparency="true"
        allowfullscreen="true"
        frameborder="0"
        height="831"
        data-instgrm-payload-id="instagram-media-payload-0"
        scrolling="no"
        style="background: white; max-width: 540px; width: calc(100% - 2px); border-radius: 3px; border-width: 1px; border-style: solid; border-color: rgb(219, 219, 219); box-shadow: none; margin-right: 0px; margin-bottom: 12px; margin-left: 0px; min-width: 326px;">
      </iframe>`
}

function instagram_post_url_for_url ( url ) {
  var instagram_post_url_regex = /https:\/\/www\.instagram\.com\/p\/\S*\//g
  var instagram_post_url_match = url.match( instagram_post_url_regex )
  // early return empty string if no url match is found
  if ( instagram_post_url_match.length === 1 ) instagram_post_url = instagram_post_url_match[ 0 ]
  else instagram_post_url = null
  // 1. split the url on forward slashes
  // 2. preserve the first 5 parts of the url, which make up the
  // unique post url.
  // 3. add an extra empty string to the end in order
  // 4. recreate the string using the split character, /
  return instagram_post_url.split( /\//g ).slice( 0, 5 ).concat( [ '' ] ).join( '/' )
}

function iframe_lazy_load_div_for_url ( url ) {
  return `
    <div
      data-lazy-load-type="iframe"
      data-lazy-load-src="${ url }"></div>`
}

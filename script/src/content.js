global.jQuery = $ = require("jquery");

var lines = require( './line-svg.js' )( {
  selector: '.line-svg',
  groupBy: 'data-line-id',
} )

var question = require('./accordion.js')( {
  containerClass: 'question-container',
  contentClass: 'answer',
  displayContentClass: 'show',
} )

question.emitter.on( 'opened', documentSizeChanged )
question.emitter.on( 'closed', documentSizeChanged )

var sliders = require('./sliders.js')( {
  selector: 'gallery__slider',
  slick: {
    autoplay: false,
    lazyLoad: 'ondemand',
    centerMode: true,
    infinite: true,
    mobileFirst: true,
    swipeToSlide: true,
    swipeToSlide: true,
    prevArrow: `<button class="gallery__arrows gallery__previous">&#9664;&#xfe0e;</button>`,
    nextArrow: `<button class="gallery__arrows gallery__next">&#9654;&#xfe0e;</button>`,
    responsive: [
      {
        breakpoint: 319,
        settings: {
          adaptiveHeight: true,
          arrows: true,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: 'calc((100vw - 319px - 2rem) / 2)',
        }
      },
      {
        breakpoint: 652,
        settings: {
          adaptiveHeight: false,
          arrows: true,
          centerMode: true,
          slidesToShow: 2,
          centerPadding: 'calc((100vw - 652px - 2rem) / 2)',
        }
      },
      {
        breakpoint: 984,
        settings: {
          adaptiveHeight: false,
          arrows: true,
          centerMode: true,
          slidesToShow: 3,
          centerPadding: 'calc((100vw - 984px - 4rem) / 2)',
        }
      },
      {
        breakpoint: 984,
        settings: {
          adaptiveHeight: false,
          arrows: true,
          centerMode: true,
          slidesToShow: 3,
          centerPadding: '2rem',
        }
      },
    ],
  }
} )

function documentSizeChanged () {
  window.postMessage( 'start-here::document-size-changed', window.location.origin )
}

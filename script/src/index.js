global.jQuery = require("jquery");

var lines = require( './line-svg.js' )( {
  selector: '.line-svg',
  groupBy: 'data-line-id',
} )
var accordion = require('./accordion.js')();
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
    prevArrow: `<button class="gallery__arrows gallery__previous">◀</button>`,
    nextArrow: `<button class="gallery__arrows gallery__next">▶</button>`,
    responsive: [
      {
        breakpoint: 326,
        settings: {
          arrows: true,
          centerMode: true,
          slidesToShow: 1,
          centerPadding: 'calc((100vw - 328px - 2rem) / 2)',
        }
      },
      {
        breakpoint: 652,
        settings: {
          arrows: true,
          centerMode: true,
          slidesToShow: 2,
          centerPadding: 'calc((100vw - 656px - 2rem) / 2)',
        }
      },
      {
        breakpoint: 978,
        settings: {
          arrows: true,
          centerMode: true,
          slidesToShow: 3,
          centerPadding: 'calc((100vw - 984px - 4rem) / 2)',
        }
      },
      {
        breakpoint: 1630,
        settings: {
          arrows: true,
          centerMode: true,
          slidesToShow: 5,
          centerPadding: 'calc((100vw - 1640px - 4rem) / 2)',
        }
      },
    ],
  }
} )

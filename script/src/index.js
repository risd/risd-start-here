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
    // slidesToShow: 1,
    // centerPadding: '40px',
    centerMode: true,
    infinite: true,
    mobileFirst: true,
    // adaptiveHeight: true,
    prevArrow: `<button class="gallery__arrows gallery__previous">◀</button>`,
    nextArrow: `<button class="gallery__arrows gallery__next">▶</button>`,
    // responsive: [
    //   {
    //     breakpoint: 326,
    //     settings: {
    //       arrows: true,
    //       centerMode: true,
    //       centerPadding: '40px',
    //       slidesToShow: 1,
    //     }
    //   },
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       arrows: true,
    //       centerMode: true,
    //       centerPadding: '40px',
    //       slidesToShow: 2,
    //     }
    //   },
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       arrows: true,
    //       centerMode: true,
    //       centerPadding: '40px',
    //       slidesToShow: 2,
    //     }
    //   },
    // ],
  }
} )

global.jQuery = require("jquery");

var nav = require( './nav.js' )()

var lines = require( './line-svg.js' )( {
  selector: '.line-svg',
  groupBy: 'data-line-id',
} )

var hero = require( './hero.js' )( {
  animationTimeout: 4000,
} )

var question = require('./accordion.js')( {
  containerClass: 'question-container',
  contentClass: 'answer',
  displayContentClass: 'show',
} )

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
        breakpoint: 984,
        settings: {
          arrows: true,
          centerMode: true,
          slidesToShow: 3,
          centerPadding: 'calc((100vw - 984px - 4rem) / 2)',
        }
      },
      {
        breakpoint: 1640,
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

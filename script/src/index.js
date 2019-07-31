global.jQuery = require("jquery");

var lines = require( './line-svg.js' )( {
  selector: '.line-svg',
  groupBy: 'data-line-id',
} )
var accordion = require('./accordion.js')();
var sliders = require('./sliders.js')( {
  selector: 'slider-container',
  slick: {
    autoplay: false,
    lazyLoad: 'ondemand',
  }
} )

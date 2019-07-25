global.jQuery = require("jquery");

var accordion = require('./accordion.js')();
var sliders = require('./sliders.js')( {
  selector: 'slider-container',
  slick: {
    autoplay: false,
    lazyLoad: 'ondemand',
  }
} )

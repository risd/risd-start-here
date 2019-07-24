global.jQuery = require("jquery");

var accordion = require('./accordion.js')();
var SetIFramePositionRelative = require( './set-selector-style-on-load.js' )( {
  selector: 'iframe.instagram-media',
  styles: {
    position: 'relative',
  }
} )

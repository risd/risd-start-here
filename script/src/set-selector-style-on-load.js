var $ = require('jquery');

module.exports = SetSelectorStyleOnLoad;

/**
 * Set the css for an element on load.
 * @param {object} options
 * @param {string} options.selector
 * @param {object} options.styles
 */
function SetSelectorStyleOnLoad ( options ) {
  if ( ! ( this instanceof SetSelectorStyleOnLoad ) ) {
    return new SetSelectorStyleOnLoad( options )
  }
  var selector = options.selector
  var styles = options.styles

  $( selector ).each( function ( index ) {
    var $element = $( this )
    $element.on( 'load', function () {
      $element.css( styles )
    } )
  } )
}

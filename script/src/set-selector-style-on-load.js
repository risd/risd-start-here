var $ = global.jQuery;

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

  console.log( 'styles' )
  console.log( styles )

  $( selector ).each( function ( index ) {
    var $element = $( this )
    console.log( '$element' )
    console.log( $element )
    $element.on( 'load', function () {
      console.log( 'load' )
      console.log( $element )
      $element.css( styles )
    } )
  } )
}

var $ = global.jQuery;

var { hydrateComponents } = require('@risd/react-hydrator');
var { themes } = require('@risd/ui');

module.exports = Nav;

function Nav(opts) {
  if (!(this instanceof Nav)) {
    return new Nav(opts);
  }

  var selector = '[data-react-component="Nav"]'
  var $selector = $( selector )
  
  // Hydrate React components
  hydrateComponents( themes.startHere )

  // unhide nav element once it's hydrated
  var navElement = document.querySelector( selector );
  if ( ! navElement ) return

  navElement.style.display = 'block';

  var $header = $selector.children( 'header' )

  return {
    height: navHeight,
  }

  function navHeight () {
    return $header.outerHeight()
  }
}

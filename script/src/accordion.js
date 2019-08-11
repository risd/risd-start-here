var $ = global.jQuery;

module.exports = Accordion;

/**
 * Creates an accordian out of the specified
 * `containerClass`. When clicked, the
 * `displayContentClass` is applied,
 * and the `contentClass` has its height animated.
 * 
 * @param {object} options
 * @param {string} options.containerClass      The container to use as the target for toggling the accordion.
 * @param {string} options.contentClass        The content to display on click
 * @param {string} options.displayContentClass The class to apply to the container to dislay the content class element.
 * @param {object?} options.peaking
 * @param {function|number} options.peaking.height    If peaking is defined, there must be a function or number passed in.
 * @param {string} options.peaking.class              Optional class to applie to the container while peaking.
 */
function Accordion ( options ) {
  if (!(this instanceof Accordion)) {
    return new Accordion( options );
  }

  var containerClass = options.containerClass
  var containerSelector = `.${ containerClass }`
  var contentClass = options.contentClass
  var contentSelector = `.${ contentClass }`
  var displayContentClass = options.displayContentClass
  var peaking = options.peaking;
  var peakingClass = options.peakingClass
  var peakingHeight = options.peakingHeight

  var $containers = $( containerSelector )

  $containers.click( toggleDisplay )

  if ( peaking && typeof peaking.height === 'function' ) {
    var peakingHeightFunction = peakingHeight
  }
  else if ( peaking && typeof peaking.height === 'number' ) {
    var peakingHeightFunction = function peakMax ( actualHeight ) {
      if ( actualHeight > peakingHeight ) return peakingHeight;
      else return actualHeight;
    }
  }
  else if ( peaking ) {
    throw new Error( `
      Must set a valid PeakingObject for options.peaking, if you want to use it.
      
      PeakingObject : {
        height : ( actualHeight ) => peakingHeight |
                 Number,
        class : String
      }

      If \`options.peaking.height\` is a Number, it will be the maximum peaking height.

      \`options.peaking.class\` can optionally be applied while peaking.` )
  }
  else {
    // peaking not defined
    var peakingHeightFunction = null;
  }

  if ( peaking && peaking.height ) {
    $containers     
      .mouseenter( showPeak )
      .mouseleave( hidePeak ) 
  }
  
  $( window ).resize( setContentHeightHandler )


  function setContentHeightHandler () {
    $containers
      .find( displayContentClass )
      .each( setContentHeight )

    function setContentHeight ( index, element ) {
      expand( { element: element } )
    }
  }

  function toggleDisplay ( click ) {
    var $target = $( click.target )

    // guard against processing clicks who originate
    // within the answer
    if ( $target.hasClass( contentClass ) || $target.parents( contentSelector ).get( 0 ) !== undefined ) return
      
    var $container = $( this )

    var content = $container.find( contentSelector ).get( 0 )

    if ( content === undefined ) return

    var isShowing = $container
      .toggleClass( displayContentClass )
      .hasClass( displayContentClass )

    var animation = {
      element: content,
      class: displayContentClass,
    }

    if ( isShowing ) {
      expand( animation )
    }
    else {
      collapse( animation )
    }
  }

  function showPeak ( mouseenter ) {
    var $container = $( this )

    if ( $container.hasClass( displayContentClass ) ) return

    var content = $container.find( contentSelector ).get( 0 )

    if ( content === undefined ) return

    var animation = {
      element: content,
      class: peaking && peaking.class ? peaking.class : null,
      height: peakingHeightFunction,
    }

    expand( animation )
  }

  function hidePeak ( mouseleave ) {
    var $container = $( this )

    if ( $container.hasClass( displayContentClass ) ) return

    var content = $container.find( contentSelector ).get( 0 )

    if ( content === undefined ) return

    var animation = {
      element: content,
      class: peakingClass,
    }

    collapse( animation )
  }
}


function collapse ( options ) {
  var element = options.element
  var cls = options.class

  // get the height of the element
  var sectionHeight = element.scrollHeight

  // temporarily disable css transitions
  var elementTransition = element.style.transition
  element.style.transition = ''

  if ( cls ) element.classList.remove( cls )

  requestAnimationFrame( function () {
    element.style.height = sectionHeight + 'px'
    element.style.transition = elementTransition

    requestAnimationFrame( function () {
      element.style.height = 0 + 'px'
    } )
  } )
}

function expand ( options ) {
  var element = options.element
  var cls = options.class
  var scrollHeight = options.height

  var sectionHeight = typeof scrollHeight === 'function'
    ? scrollHeight( element.scrollHeight )
    : element.scrollHeight

  if ( cls ) element.classList.add( cls )

  element.addEventListener( 'transitionend', transitionEndHandler )

  element.style.height = sectionHeight + 'px';

  function transitionEndHandler ( event ) {
    element.removeEventListener( 'transitionend', transitionEndHandler )

    element.style.height = null
  }
}

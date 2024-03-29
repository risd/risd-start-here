var $ = require('jquery');
var EventEmitter = require( 'events' )
var cssTimeToMS = require( './css-time-to-ms.js' )

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
  var closePreviouslyOpen = typeof options.closePreviouslyOpen === 'boolean'
    ? options.closePreviouslyOpen
    : false

  var $containers = $( containerSelector )

  $containers.click( toggleDisplay )

  var emitter = new EventEmitter()

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

  return {
    emitter: emitter,
    $containers: $containers,
    containerClass: containerClass,
  }


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

    if ( closePreviouslyOpen ) {
      var $toClose = $( `.${ containerClass }.${ displayContentClass }` )  
    }

    var isShowing = $container
      .toggleClass( displayContentClass )
      .hasClass( displayContentClass )

    var animation = {
      element: content,
    }

    var collapsingHeight = null

    if ( closePreviouslyOpen &&
         $toClose.get( 0 ) &&
         $toClose.find( contentSelector ).get( 0 ) &&
         $toClose.attr( 'id' ) !== $container.attr( 'id' ) ) {
      // there is an existing container that is open,
      // and not the one we are currently toggling.
      // lets collapse it, to keep just one container open
      // and if it happens to be above the toggle container
      // lets animate the scrollTop for the document as well.
      var $contentToClose = $toClose.find( contentSelector )
      var contentToCloseTop = $contentToClose.offset().top
      var containerToToggle = $container.offset().top
      // closing content is above the container we are toggling
      if ( contentToCloseTop < containerToToggle ) {
        collapsingHeight = $contentToClose.get( 0 ).scrollHeight
      }
      $toClose.removeClass( displayContentClass )
      collapse( {
        element: $contentToClose.get( 0 ),
      } )
    }

    if ( isShowing && closePreviouslyOpen ) {
      expand( Object.assign( animation, {
        collapsingHeight: collapsingHeight,
        scrollToPosition: collapsingHeight
          ? $container.offset().top
          : null
      } ) )
    }
    else if ( isShowing ) {
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

  function collapse ( options ) {
    var element = options.element
    var cls = options.class

    // get the height of the element
    var sectionHeight = element.scrollHeight

    var duration = cssTimeToMS(
        getComputedStyle( element )
          .getPropertyValue( '--transition-duration' ) )

    // temporarily disable css transitions
    var elementTransition = element.style.transition
    element.style.transition = ''

    if ( cls ) element.classList.remove( cls )

    if ( duration > 0 ) {
      element.addEventListener( 'transitionend', closedHandler )
    }

    emitter.emit( 'closing', element )

    requestAnimationFrame( function () {
      element.style.height = sectionHeight + 'px'
      element.style.transition = elementTransition

      requestAnimationFrame( function () {
        element.style.height = 0 + 'px'

        if ( duration > 0 ) {
          closedHandler()
        }
      } )
    } )

    function closedHandler () {
      emitter.emit( 'closed', element )
      element.removeEventListener( 'transitionend', closedHandler )
    }
  }

  function expand ( options ) {
    var element = options.element
    var cls = options.class
    var scrollHeight = options.height
    var collapsingHeight = options.collapsingHeight;
    var scrollToPosition = options.scrollToPosition;


    var sectionHeight = typeof scrollHeight === 'function'
      ? scrollHeight( element.scrollHeight )
      : element.scrollHeight

    if ( cls ) element.classList.add( cls )
    
    var duration = cssTimeToMS(
      getComputedStyle( element )
        .getPropertyValue( '--transition-duration' ) )

    if ( duration > 0 ) {
      element.addEventListener( 'transitionend', transitionEndHandler )  
    }

    emitter.emit( 'opening', element )

    if ( collapsingHeight ) {
      // if ( collapsingHeight > sectionHeight ) {
      //   duration = duration * collapsingHeight / sectionHeight
      // }

      $( 'html,body' )
        .animate( {
          scrollTop: scrollToPosition - collapsingHeight
        }, duration )  
    }

    element.style.height = sectionHeight + 'px';

    if ( duration === 0 ) {
      openedHandler()
    }

    function transitionEndHandler ( event ) {
      openedHandler()
      element.removeEventListener( 'transitionend', transitionEndHandler )
      // element.style.height = null
    }

    function openedHandler () {
      emitter.emit( 'opened', element )
    }
  }
}

var $ = global.jQuery;

module.exports = accordion;

function accordion() {
  if (!(this instanceof accordion)) {
    return new accordion();
  }

  var $questions = $( '.question-container' )

  $questions
    .click( toggleDisplay )
    // .mouseenter( showPeak )
    // .mouseleave( hidePeak )
}

function toggleDisplay ( question ) {
  var $target = $( question.target )

  if ( $target.parent( '.answer' ).get( 0 ) !== undefined ) return
    
  var $container = $( this )

  var isShowing = $container
    .toggleClass( 'show' )
    .hasClass( 'show' )

  var answer = $container.find( '.answer' ).get( 0 )

  if ( answer === undefined ) return

  var animation = {
    element: answer,
    class: 'show',
  }

  if ( isShowing ) {
    expand( animation )
  }
  else {
    collapse( animation )
  }
}

function showPeak ( question ) {
  var $container = $( this )

  if ( $container.hasClass( 'show' ) ) return

  var answer = $container.find( '.answer' ).get( 0 )

  if ( answer === undefined ) return

  var animation = {
    element: answer,
    class: 'peaking',
    height: function ( actualHeight ) {
      if ( actualHeight > 80 ) return 80
      return actualHeight
    },
  }

  expand( animation )
}

function hidePeak ( question ) {
  var $container = $( this )

  if ( $container.hasClass( 'show' ) ) return

  var answer = $container.find( '.answer' ).get( 0 )

  if ( answer === undefined ) return

  var animation = {
    element: answer,
    class: 'peaking',
  }

  collapse( animation )
}

function collapse ( options ) {
  var element = options.element
  var cls = options.class

  // get the height of the element
  var sectionHeight = element.scrollHeight

  // temporarily disable css transitions
  var elementTransition = element.style.transition
  element.style.transition = ''

  requestAnimationFrame( function () {
    element.style.height = sectionHeight + 'px'
    element.style.transition = elementTransition

    requestAnimationFrame( function () {
      element.style.height = 0 + 'px'
    } )
  } )

  element.classList.remove( cls )
}

function expand ( options ) {
  var element = options.element
  var cls = options.class
  var scrollHeight = options.height

  var sectionHeight = typeof scrollHeight === 'function'
    ? scrollHeight( element.scrollHeight )
    : element.scrollHeight

  element.style.height = sectionHeight + 'px';

  // element.addEventListener( 'transitionend', transitionEndHandler )

  element.classList.add( cls )

  function transitionEndHandler ( event ) {
    element.removeEventListener( 'transitionend', transitionEndHandler )

    element.style.height = null
  }
}

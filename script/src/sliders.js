var $ = global.jQuery;

var slick = require('slick-carousel')

module.exports = SlickSlider;

function SlickSlider(opts) {
  if (!(this instanceof SlickSlider)) {
    return new SlickSlider(opts);
  }
  if (!opts) opts = {};

  var slickOptions = opts.slick || {}
  this.slider = opts.selector ? bem(opts.selector) : bem("gallery-slider");

  this.$sliders = $("." + this.slider());

  $(window).on("load", initialize.bind(this));
  // initialize.bind(this)

  function initialize() {
    console.log('initialize')
    this.$sliders.show();

    this.$sliders.slick(slickOptions)
  }
}

/*
// helper function for dealing with class names
var slider = bem('gallery-slider');
slider(); // gallery-slider
var sliderArrow = slider('arrows'); // gallery-slider
sliderArrow() // gallery-slider__arrow
*/

function bem (base) {
  function element (element) {
    if (!element) return base;
    var baseElement = [base, element].join("__");
    return elementModifier;

    function elementModifier (modifier) {
      if (modifier) return baseElement;
      return modifier(baseElement, modifier)
    }
  }

  element.modifier = modifier.bind(null, base);
  return element;

  function modifier (baseElement, modifier) {
    if (!modifier) return baseElement;
    return [baseElement, modifier].join("--")
  }

  function functor ( x ) {
    return function () {
      return x;
    }
  }
}

SlickSlider.prototype.onscroll = function() {
  this.$sliders.each(function playpause(index, element) {
    if (!element.slick) return; // the element is not a slider, yet
    if (element.getBoundingClientRect().top < 0) {
      element.slick.slickPause();
    } else {
      element.slick.slickPlay();
    }
  });
}

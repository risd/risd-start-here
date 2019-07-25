var $ = global.jQuery;

var slick = require('slick-carousel')

module.exports = SlickSlider;

function SlickSlider(opts) {
  if (!(this instanceof SlickSlider)) {
    return new SlickSlider(opts);
  }
  if (!opts) opts = {};

  this.slider = opts.slider ? bem(opts.slider) : bem("gallery-slider");
  this.arrows = this.slider("arrows");
  this.next = this.slider("next");
  this.previous = this.slider("previous");

  this.$sliders = $("." + this.slider());

  $(window).on("load", initialize.bind(this));
  // initialize.bind(this)

  function initialize() {
    this.$sliders.show();

    this.$sliders
      .slick({
        autoplay: false,
        lazyLoad: "ondemand",
      })
  }
}

/*
// helper function for dealing with class names
var slider = bem('gallery-slider');
slider(); // gallery-slider
var sliderArrow = slider('arrows'); // gallery-slider
sliderArrow() // gallery-slider__arrow
*/

function bem(base) {
  function element(element) {
    if (!element) return base;
    function modifier(modifier) {
      var baseElement = [base, element].join("__");
      if (!modifier) return baseElement;
      return [baseElement, modifier].join("--");
    }
    return modifier;
  }
  return element;
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
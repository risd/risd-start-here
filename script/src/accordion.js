var $ = global.jQuery;

module.exports = accordion;

function accordion() {
  if (!(this instanceof accordion)) {
    return new accordion();
  }
  // console.log('activeNav initialized.');

  $('.question').click(function(){
    // console.log('clicked!');
    $(this).siblings('.answer').toggleClass('show');
  });
}

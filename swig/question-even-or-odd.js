module.exports = {
  questionEvenOrOdd: questionEvenOrOdd,
  isEvenOrOdd: isEvenOrOdd,
}

function questionEvenOrOdd ( input ) {
  return isEven( input )
    ? 'question-even'
    : 'question-odd'
}

function isEvenOrOdd ( input, even, odd ) {
  return isEven( input )
    ? even
    : odd
}

function isEven ( input ) {
  if ( typeof input === 'string' ) {
    try {
      input = Number(input)
    } catch ( error ) {
      return false;
    }
  }
  if ( isNaN( input ) ) return false;
  return input % 2 === 0
}

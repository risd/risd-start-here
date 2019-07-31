module.exports = {
  concatClone: concatClone,
}

function concatClone ( arr, value ) {
  if ( Array.isArray( value ) ) {
    var cloned = arr.concat( value.slice( 0 ) )
  }
  else if ( typeof value === 'object' ) {
    var cloned = arr.concat( [ Object.assign( {}, value ) ] )
  }
  else {
    var cloned = arr;
  }
  return cloned;
}

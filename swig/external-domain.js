module.exports = {
  external_domain: external_domain,
}

function external_domain ( input ) {
  if ( input.startsWith( 'http' ) ||
       input.startsWith( '//' ) ) return true
  else return false
}

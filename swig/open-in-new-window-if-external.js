var external_domain = require( './external-domain.js' ).external_domain

module.exports = {
  openInNewWindowIfExternalLink: openInNewWindowIfExternalLink,
}

function openInNewWindowIfExternalLink ( input ) {
  if ( external_domain( input ) ) return 'target="_blank"'
  else return ''
}

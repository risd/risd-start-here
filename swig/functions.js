var filters = require( './filters.js' )

module.exports = {
  openInNewWindowIfExternalLink: openInNewWindowIfExternalLink,
}

function openInNewWindowIfExternalLink ( input ) {
  if ( filters.external_domain( input ) ) return 'target="_blank"'
  else return ''
}

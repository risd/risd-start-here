module.exports = {
  rollup_galleries: rollup_galleries,
}

function rollup_galleries ( input ) {
  // ensure we are using the layout bug free version of the instagram embed
  input = input.replace( /www.instagram.com\/embed.js/g, 'platform.instagram.com/en_US/embeds.js' )
  return input
}

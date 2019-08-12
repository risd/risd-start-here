var fs = require( 'fs' )

var linkBreak = {
  link_url: 'https://www.risd.edu/schedule-a-tour/',
  link_text: 'Visit Campus',
}

var path = './.build/data.json'
var root = readJson( path )
root.data.listofquestions.questions =
  root.data.listofquestions.questions.slice( 0, 3 )
    .concat( [ linkBreak ] )
    .concat( root.data.listofquestions.questions.slice( 3 ) )
fs.writeFileSync( path, JSON.stringify( root, null, 2 ) )

function readJson ( path ) {
  return JSON.parse( fs.readFileSync( path ).toString() )
}

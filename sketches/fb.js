// fb api can only be used to manage
// your own posts, and you have to be a
// business account.

var FB = require('fb');
const express = require('express');
var url = require( 'url' )
var request = require( 'request' )

var appId = '1091865207870009'
var appSecret = '955525f0cc61040b8dcf2234b9257a5d'
var clientToken = '08fec482e540c9407a6b96ea5eef116a'
var appToken = '1091865207870009|mYbOlE4iily3AeoWuOQeA37GPq4'
var host = 'http://localhost:3000'
var code_path = '/auth/facebook/'
var code_redirect_path = `${ code_path }callback/`
var token_redirect_path = '/auth/facebook/token/callback/'
var code_uri = `${ host }${ code_path }`
var code_redirect_uri = `${ host }${ code_redirect_path }`
var token_redirect_uri = `${ host }${ token_redirect_path }`

var fb = new FB.Facebook({
  appId: appId,
  appSecret: appSecret,
});
const app = express();

app.get('/auth/facebook/', (req, res) => {
  var fbAuth = `
    https://www.facebook.com/v4.0/dialog/oauth?
      client_id=${ appId }
      &redirect_uri=${ code_redirect_uri }
      &response_type=code
      `.split( '\n' ).map(s=>s.trim()).join('')
  res.redirect( fbAuth )
})

app.get( code_redirect_path, (req, res) => {
  var parsedUrl = url.parse( req.url, true )

  if ( parsedUrl && parsedUrl.query && parsedUrl.query.code ) {
    var code = parsedUrl.query.code
    var fbAuth = `
      https://graph.facebook.com/v4.0/oauth/access_token?
        client_id=${ appId }
        &redirect_uri=${ code_redirect_uri }
        &client_secret=${ appSecret }
        &code=${ code }
    `.split( '\n' ).map(s=>s.trim()).join('')
    
    request( fbAuth, (err, response, body) => {
      if ( err ) {
        console.log( 'err' )
        console.log( err )
        return res.json( err )
      }
      else if ( body ) {
        var body = JSON.parse( body )
        if ( body.access_token ) { 
          console.log( 'body.access_token' )
          var access_token = body.access_token;
          getMediaId( access_token ) 
        }
        else {
          return res.json( body )
        }
      }
      else if ( response ) {
        console.log( 'response' )
        return res.json( response )
      }
    } )
  }
  else {
    res.end('no code:', JSON.stringify(parsedUrl))
  }

  function getMediaId ( access_token ) {
    fb.setAccessToken( access_token )
    fb.api( '1880679807664340415_3944266703', function ( media ) {
      if(!media || media.error) {
        console.log(!media ? 'error occurred' : media.error);
        res.json(media.error)
        return;
      }

      console.log(media)
      return res.json( media )
    } )
  }

} )

// listen to port 3000
app.listen(3000, () => {
  console.log(`visit: ${ code_uri }`);
})

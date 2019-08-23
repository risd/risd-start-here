// attempt to see if the no longer documented
// media/:media-id endpoint works
// it appears it does not.

var Instagram = require( 'node-instagram' ).default
const express = require('express');
var urlSegmentToInstagramId = require ('instagram-id-to-url-segment').urlSegmentToInstagramId

// Your redirect url where you will handle the code param
const redirectUri = 'http://localhost:3000/auth/instagram/callback/';

const instagram = new Instagram({
  clientId: 'dc534359282949cda24fe6d3a35b5854',
  clientSecret: 'a3db797c1a3e49d1acc7142078e7669b',
});

// urlSegmentToInstagramId promised to get the id from BoZhFIgFT2_
// var mediaId = urlSegmentToInstagramId( 'BoZhFIgFT2_' )
// this was the url, when using the embed-ig.js test
var mediaId = '1880679807664340415_3944266703'
// neither returns a valid response. we get a
// `APINotFoundError` error

// create express server
const app = express();

// Redirect user to instagram oauth
app.get('/auth/instagram/', (req, res) => {
  res.redirect(instagram.getAuthorizationUrl(redirectUri, { scope: ['basic'] }));
});

// Handle auth code and get access_token for user
app.get('/auth/instagram/callback/', (req, res) => {
  try {
    instagram.authorizeUser(req.query.code, redirectUri, (err, data) => {
      if ( err ) console.log( err )
      // access_token in data.access_token
      instagram.get(`media/${ mediaId }`, { access_token: data.access_token })
        .then(media => {
          res.json(media);
        })
        .catch(err => {
          err.on = 'media'
          res.json(err)
        })
    });
  } catch (err) {
    err.on = 'callback'
    res.json(err);
  }
});

// listen to port 3000
app.listen(3000, () => {
  console.log('visit: http://localhost:3000/auth/instagram/');
});

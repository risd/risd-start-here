/**
 * ListOfQuestions : { questions: [ { question, answer } ] }
 *
 * ListOfQuestionsToQuestionAnswer :
 *   ListOfQuestions => [ QuestionAnswer : { question, answer, _id } ]
 *
 * ListedQuestionAnswer :
 *   [ QuestionAnswer ] =>
 *     homepage.content_list[ index ].question__answer =
 *       "questionanswer {._id}"
 */

var conf = readJSON( '.firebase.conf' )
var db = siteFirebaseRef( conf )

authenticateFirebase( conf )
  .then( contentTypeData.bind( null, 'listofquestions' ) )
  .then( listOfQuestionsToQuestionAnswer )
  .then( saveInHomepage )
  .then( handleExit.bind( null, null ) )
  .catch( handleError )

function saveInHomepage ( qaKV ) {
  return new Promise ( function ( resolve, reject ) {
    var contentList = qaKV.map( qaKVToContentList )
    contentTypeDataRef( 'homepage' )
      .child( 'content_list' )
      .set( contentList, handleDataSet )

    function handleDataSet ( error ) {
      if ( error ) return reject( error )
      resolve()
    }
  } )

  function qaKVToContentList ( qaKV ) {
    return {
      nickname: qaKV.value.name,
      question__answer: `questionanswer ${ qaKV.key }`,
    }
  }
}

function listOfQuestionsToQuestionAnswer ( listOfQuestions ) {
  var tasks = listOfQuestions.questions.map( toQuestionAnswerTask )

  return Promise.all( tasks )

  function toQuestionAnswerTask ( listedQuestion ) {
    return new Promise ( function ( resolve, reject ) {
      var qaRef = contentTypeDataRef( 'questionanswer' ).push()
      var qaValue = Object.assign(
        { name: listedQuestion.question },
        listedQuestion )

      qaRef.set( whRequiredFields( qaValue ), handleDataSet )

      function handleDataSet ( error ) {
        if ( error ) {
          console.log( `Could not save: ${ listedQuestion.question }` )
        }
        console.log( `questionanswer ${ qaRef.key }` )
        resolve( {
          key: qaRef.key,
          value: qaValue,
        } )
      }
    } )
  }
}

function logValue ( value ) {
  console.log( value )
  handleExit()
}

function handleError ( error ) {
  console.log( error )
  handleExit( error )
}

function handleExit ( error ) {
  process.exit( error ? 1 : 0 )
}

/* --- lib --- */

function whRequiredFields ( entry ) {
  var moment = require( 'moment' )

  var time = new Date()
  var formattedTime = moment( time ).format()
  var machineTime = time.getTime()

  return Object.assign( {
    create_date: formattedTime,
    publish_date: formattedTime,
    last_updated: formattedTime,
    _sort_create_date: machineTime,
    _sort_last_updated: machineTime,
    _sort_publish_date: machineTime,
    preview_url: guid(),
  }, entry )
}

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function contentTypeData ( contentType ) {
  return new Promise ( function ( resolve, reject ) {
    contentTypeDataRef( contentType )
      .once( 'value', onSnapshot, onError )

    function onSnapshot ( snapshot ) {
      resolve( snapshot.val() )
    }

    function onError ( error ) {
      reject( error )
    }
  } )
}

function contentTypeDataRef ( contentType ) {
  return db.child( 'data' )
    .child( contentType )
}

function siteFirebaseRef ( opts ) {
  var firebase = require('firebase')
  var firebaseName = opts.firebase
  var firebaseAPIKey = opts.firebaseAPIKey

  firebase.initializeApp( {
    apiKey: firebaseAPIKey,
    authDomain: `${ firebaseName }.firebaseapp.com`,
    databaseURL: `${ firebaseName }.firebaseio.com`,
  } )

  return firebase.database().ref('buckets/' + opts.siteName + '/' + opts.siteKey + '/dev')
}

function authenticateFirebase ( opts ) {
  var firebase = require('firebase')
  return firebase.auth().signInWithEmailAndPassword( opts.email, opts.password )
}

function readJSON ( path ) {
  return JSON.parse( require( 'fs' ).readFileSync( path ).toString() )
}
  
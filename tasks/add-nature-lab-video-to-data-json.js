var fs = require( 'fs' )

var natureLab = {
  "hero_image": {
    "height": 1000,
    "resize_url": "http://lh3.googleusercontent.com/3DguC6NEMz4sc2rQdAa61dSRiNgvRw-HcXrdQN1-Gtd2mhwrqL4oL3yDLEqn8fi1Zowl94x5qhQ-3iMaHJFcsWgj4nFNfMSqDarVCkF7-nU",
    "size": 163926,
    "type": "image/jpeg",
    "url": "//cdn.risd.systems/webhook-uploads/1559584633392_D52A6805.jpg",
    "width": 1000
  },
  "hero_video": {
    "author_name": "the Nature Lab at RISD",
    "author_url": "https://vimeo.com/user35408795",
    "description": "Video of Northern Lined Seahorse by Georgia Rhodes",
    "height": 360,
    "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F340040317%3Fapp_id%3D122963&dntp=1&url=https%3A%2F%2Fvimeo.com%2F340040317&image=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F788254000_640.jpg&key=1f7aec2250b8486ba950a582d65e4cc9&type=text%2Fhtml&schema=vimeo\" width=\"640\" height=\"360\" scrolling=\"no\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen=\"true\"></iframe>",
    "original_url": "https://vimeo.com/340040317",
    "provider_name": "Vimeo",
    "provider_url": "https://vimeo.com/",
    "thumbnail_height": 360,
    "thumbnail_url": "https://i.vimeocdn.com/video/788254000_640.jpg",
    "thumbnail_width": 640,
    "title": "Northern Lined Seahorse",
    "type": "video",
    "version": "1.0",
    "width": 640
  },
}

var path = './.build/data.json'
var root = readJson( path )
root.data.listofquestions = Object.assign( natureLab, root.data.listofquestions )
fs.writeFileSync( path, JSON.stringify( root, null, 2 ) )

function readJson ( path ) {
  return JSON.parse( fs.readFileSync( path ).toString() )
}

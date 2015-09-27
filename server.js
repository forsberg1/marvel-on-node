var express = require('express')
    ,hbs = require('express-hbs')


var app = express();
app.use(express.static(__dirname + '/public'));

// Global Includes
config  = require('./config/marvel')
md5     = require('md5')
scripts = require('./scripts.js')
qs      = require('querystring');
request = require('request')

app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/application'
  ,partialsDir: __dirname + '/views/partials'
}));

app.set('view options', { layout: 'application' });
app.set('view engine', 'hbs');
// Handlebars helpers
hbs.registerHelper( "resurceToId", function (resourceURI) {
  var id = resourceURI.split('/').pop();
  return id
});

hbs.registerHelper( "marvelThumb", function ( thumbnail, size ) {
  size = "portrait_xlarge"
  switch(size) {
    case "large":
      size = "portrait_xlarge"
    break;
    case "medium":
      size = "portrait_medium"
    break;
    case "small":
      size = "portrait_small"
    break;
  }
  return build_thumb_src = thumbnail.path + "/" + size + ".jpg"
});

app.get('/', function(request, response) {
  response.render('search')
});

app.get('/characters/search', function(req, res) {
  query = req.query.q
  var request_uri = config.marvel.end_point + "/v1/public/characters?nameStartsWith=" + query + '&' +scripts.Marvel.auth_query()
  var options = { url: request_uri, method: "GET"}
  function callback(error, response, body) {

   if (!error && response.statusCode == 200) {
     var characters = JSON.parse(body);
     result = {}
     is_error = Object.keys(characters).length == 0

     if (is_error || characters.data.results.length == 0) {
       result = {notice: 'Ohhh snap no superhero found :('}
     } else {
       result = {character: characters.data.results}
     }
     console.log(result)
     res.render('characters', result)
   } else {
       res.render('application', {notice: "Ohh no, technical issues"})
     }
   }

   request(options, callback)

});

app.get('/character/:id(\\d+)/', function(req, res) {
  var character_id = req.params.id
  var character_uri  = config.marvel.end_point + "/v1/public/characters/"+character_id+'?'+scripts.Marvel.auth_query()
  var options      = { url: character_uri, method: "GET" }

  function callback(error, response, body) {
    var character = JSON.parse(body);
    console.log(character.data.results[0].stories)
    res.render('character', {character: character.data.results[0]})
  }

  request(options, callback)


})

var port = process.env.PORT || 3000

app.listen(port, function() {
    console.log('Listening on ' + port)
});

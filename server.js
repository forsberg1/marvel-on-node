var express = require('express')
    ,exphbs = require('express-handlebars')


var app = express();
app.use(express.static(__dirname + '/public'));

// Global Includes
config  = require('./config/marvel')
md5     = require('md5')
scripts = require('./scripts.js')
qs      = require('querystring');
request = require('request')

var handlebars = exphbs.create({defaultLayout: 'application'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


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
  var request_uri  = config.marvel.end_point + "/v1/public/characters/"+character_id+'?'+scripts.Marvel.auth_query()
  var options      = { url: request_uri, method: "GET" }

  function callback(error, response, body) {
    var character = JSON.parse(body);
    console.log(character.data.results)
    res.render('character', {character: character.data.results[0]})
  }
  request(options, callback)


})

var port = process.env.PORT || 3000

app.listen(port, function() {
    console.log('Listening on ' + port)
});

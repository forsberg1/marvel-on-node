module.exports = function(app) {
  

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
          result = {characters: characters.data.results}
        }

        res.render('characters', result)
      } else {
          res.render('application', {notice: "Ohh no, technical issues"})
        }
      }

      // Make request trigger render in callback
      request(options, callback)
   });

   app.get('/characters/:id(\\d+)/', function(req, res) {
     var id = req.params.id
     scripts.templateLogic.getCharacter(req, res, id)
   });
};

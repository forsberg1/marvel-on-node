exports.templateLogic = {

  getCharacters : function (req, res, character_name) {

  },
  getCharacter : function(req, res, id) {
    var request_uri = config.marvel.end_point + "/v1/public/characters/"+id+'?'+scripts.Marvel.auth_query()
    var options = { url: request_uri, method: "GET" }

    function callback(error, response, body) {
      var character = JSON.parse(body);
      console.log(character.data.results)
      res.render('application', {character: character.data.results[0]})
    }
    request(options, callback)
  },

  getStoryByCharacterId : function(req, res, id) {
    var request_uri = config.marvel.end_point + "/v1/public/characters/"+id+"/stories/"+'?'+scripts.Marvel.auth_query()
    var options = { url: request_uri, method: "GET" }
  }
}
exports.Marvel = {

  auth_query : function() {
    var time_now = Date.now()
    var private_key = config.marvel.private_key
    var public_key = config.marvel.public_key
    var hash = md5(time_now+private_key+public_key)

    params = {
      ts: time_now,
      hash: hash,
      apikey: public_key
    }

    return qs.stringify(params)
  },

  get : function(path, options) {



  }
}

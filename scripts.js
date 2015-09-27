
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
  }

}

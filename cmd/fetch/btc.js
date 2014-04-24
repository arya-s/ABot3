var config = require('../../config.js');
var btcAPI = require('../../lib/btcAPI.js');
var https = require('https');

module.exports = function(irc){
    if(btcAPI.hasOwnProperty(irc.message)){
        config.setBtcexchange(irc.message);
    }

    var out = '';
    https.get(btcAPI[config.currentbtcexchange].api, function(res){
        res.on('data', function(chunk){
            out += chunk;
        });

        res.on('end', function(){
            var json = JSON.parse(out);
            var currency = btcAPI[config.currentbtcexchange].currency;
            var price = json;
            var fetchArr = btcAPI[config.currentbtcexchange].fetch;

            for(var i=0; i<fetchArr.length; i++){
                price = price[fetchArr[i]];
            }

            irc.client.say(irc.to, currency + price + ' [' + config.currentbtcexchange + ']');
        });
    });
};

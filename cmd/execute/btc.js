var config = require('../../config.js');
var btcAPI = require('../../lib/btcAPI.js');
var fetchBTC = require('../fetch/btc.js');

module.exports = function(irc){
    if(btcAPI.hasOwnProperty(irc.message)){
        fetchBTC(irc);
    } else {
        var exchanges = Object.keys(btcAPI).join('|');
        irc.client.say(irc.to, 'Invalid exchange. Try again with <[' + exchanges + ']>');
    }
};

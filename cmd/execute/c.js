var config = require('../../config.js');
var fx = require('money');
var util = require('../../lib/util.js');

module.exports = function(irc){
    var splitted = irc.message.split(' ');

    if(splitted.length >= 3){
        var amount = util.parseNumber(splitted[0]);
        var fromCurrency = splitted[1].toUpperCase();
        var toCurrency = splitted[2].toUpperCase();

        config.oxr.latest(function() {
            fx.rates = config.oxr.rates;
            fx.base = config.oxr.base;

            try{
                var exchanged = fx(amount).from(fromCurrency).to(toCurrency);
                irc.client.say(irc.to, irc.nick + ': ' + amount + ' ' + fromCurrency + ' = ' + exchanged + ' ' + toCurrency);
            } catch (err) {
                irc.client.say(irc.to, 'Error: Please make sure you have the correct 3 letter currency codes and a valid amount.');
            }
        });
    } else {
        irc.client.say(irc.to, 'Command usage: ' + config.executeoperator + ' <amount> <3 letter from currency> <3 letter to currency>');
    }
};

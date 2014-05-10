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
    } else if(splitted.length == 1){
        var temperature = splitted[0].substring(0, splitted[0].length-1);
        var deg = splitted[0].charAt(splitted[0].length-1);

        if(deg == 'F'){
            irc.client.say(irc.to, irc.nick + ': ' + splitted[0] + ' = ' + util.toCelsius(temperature) + 'C');
        } else if(deg == 'C'){
            irc.client.say(irc.to, irc.nick + ': ' + splitted[0] + ' = ' + util.toFahrenheit(temperature) + 'F');
        } else {
            irc.client.say(irc.to, 'Command usage: ' + config.executeoperator + 'c <temperature><[F|C]>');
        }
    } else {
        irc.client.say(irc.to, 'Command usage: ' + config.executeoperator + 'c <amount> <3 letter from currency> <3 letter to currency>');
    }
};

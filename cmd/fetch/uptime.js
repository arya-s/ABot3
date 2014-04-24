var moment = require('moment');

module.exports = function(irc){
   irc.client.say(irc.to, 'I\'ve been slaving away for you shitty humans for ' + moment(irc.uptime).fromNow(true) + '.');
}; 

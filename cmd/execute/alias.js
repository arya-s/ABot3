var util = require('../../lib/util.js');
var config = require('../../config.js');

module.exports = function(irc){
    var msg = irc.message;
    var splitted = util.trim(msg.toLowerCase()).split(' ');
 
    if(splitted.length == 2){
        util.trim(msg.toLowerCase());
        var user = splitted[0];
        var alias = splitted[1];

        irc.db.getUser(user, function(err, data){
            if(!err){
                if(data.length > 0){
                    irc.db.updateUser(user, alias);
                    irc.client.say(irc.to, 'Added alias ' + alias + ' to ' + user + '.');
                } else {
                    irc.client.say(irc.to, 'I don\'t know that son of a bitch. Use ' + config.fetchoperator + 'users to list available users.');
                }
            } else {
                console.log('Could not retrieve user: ' + user + '. ', err);
            }
        });
    } else {
        irc.client.say(irc.to, 'Command usage: ' + config.executeoperator + 'alias <user> <alias>');
        irc.client.say(irc.to, 'Adds <alias> to <user>\'s existing aliases. Use ' + config.fetchoperator + 'users to list available users.');
    }
};

var config = require('../../config.js');
var util = require('../../lib/util.js');

module.exports = function(irc){
    if(irc.message.length > 0){
        irc.db.getUser(irc.message.toLowerCase(), function(err, data){
            if(!err){
                if(data.length > 0){
                    var aliases = [];

                    data[0].aliases.forEach(function(entry){
                        aliases.push(util.obscure(entry, ':'));
                    });

                    irc.client.say(irc.to, aliases.join(', '));
                    irc.client.say(irc.to, 'Ignore \':\' when using the aliases for other queries.');
                } else {
                    irc.client.say(irc.to, 'I dont\'t know that son of a bitch. User ' + config.fetchoperator + 'users to list available users and try again.');
                }
            } else {
                console.log('Error: Could not retrieve user: ' + irc.message.toLowerCase() + '. ', err);
            }
        });
    } else {
        irc.client.say(irc.to, 'Command usage: ' + config.fetchoperator + 'alias <base user>');
        irc.client.say(irc.to, 'Shows <base user>\'s aliases. Use ' + config.fetchoperator + 'users to list available users.');
    }
};

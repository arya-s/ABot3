var util = require('../../lib/util.js');

module.exports = function(irc){
    irc.db.getUsers(function(err, data){
        if(!err){
            if(data.length > 0){
                var users = [];
                data.forEach(function(entry){
                    //Obsurce username with randomly placed ':' in between to avoid highlights
                    users.push(util.obscure(entry.name, ':'));
                });

                irc.client.say(irc.to, users.join(', '));
                irc.client.say(irc.to, 'Ignore \':\' when using the username for other queries.');
            }
        } else {
            irc.client.say(irc.to, 'Don\'t bother me now. Try again later.');
            console.log('Error: Could not retrieve users. ', err);
        }
    });
};

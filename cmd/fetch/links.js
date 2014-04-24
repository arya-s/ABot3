var moment = require('moment');

module.exports = function(irc){
    irc.db.fetchLinks(function(err, data){
        console.log('',data);
        if(!err){
            data.forEach(function(link){
                if(link.description.length > 0){
                    irc.client.say(irc.to, link.description + ': ' + link.url + ' by ' + link.sender + ' ' + moment(link.sentAt).fromNow());
                } else {
                    irc.client.say(irc.to, link.url + ' by ' + link.sender + ' ' + moment(link.sentAt).fromNow());
                }
            });

            irc.client.say(irc.to, 'More at: http://abot3.herokuapp.com/'); 
        } else {
            console.log('Error fetching links.', err);
            irc.client.say(irc.to, 'Couldn\'t fetch any links. Check the damn website yourself: http://abot3.herokuapp.com/');
        }
    });
};

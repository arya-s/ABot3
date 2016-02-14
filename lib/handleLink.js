var moment = require('moment');

module.exports = function(irc){

    var url = irc.message;

    irc.db.seenLink(url, function(err, data){

        if (!err) {

            if (data.length === 0) {

                // Link is new
                irc.db.addSeenLink(url, irc.nick);

            } else {

                var seen = data[0];
                
                irc.client.say(irc.to, 'Old! Already linked by ' + seen.sender + ' ' + moment(seen.sentAt).fromNow() + '.');

            }

        }

    });

};

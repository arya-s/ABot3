var moment = require('moment');
var util = require('../../lib/util.js');

module.exports = function(irc){
    var alias = util.trim(irc.nick.toLowerCase());
    //Find the base user for this alias
    irc.db.getUserForAlias(alias, function(err, data){
        if(!err){
            if(data.length > 0){
                var user = data[0].name;

                irc.db.getNotesForUser(user, function(err, data){
                    if(!err){
                        if(data.length > 0){
                            var notes = data[0].notes;

                            notes.forEach(function(note){
                                irc.client.say(irc.to, irc.nick + ': ' + note.sender + ' left you a note ' + moment(note.sentAt).fromNow() + ': ' + note.text);
                            });

                            if(notes.length > 0){
                                //Reset user's note status
                                irc.db.resetNotes(user);
                            }
                        }
                    } else {
                        console.log('Error: Could not retrieve notes. ', err);
                    }
                });
            }
        } else {
            console.log('Error: Could not retrieve user. ', err);
        }
    });
};

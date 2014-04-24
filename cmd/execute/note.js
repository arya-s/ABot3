var util = require('../../lib/util.js');
var config = require('../../config.js');

module.exports = function(irc){
    var splitted = irc.message.split(' ');

    if(splitted.length >= 2){
        var now = Date.now();
        var receiver = util.trim(splitted.splice(0, 1)[0].toLowerCase());
        var message = splitted.join(' ');

        //Find the base user to the receiver alias because notes are stored per base user
        irc.db.getUserForAlias(receiver, function(err, data){
            if(!err){
                if(data.length > 0){
                    var user = data[0].name;
                    //Push the note to the existing notes
                    irc.db.addNote(user, { sender: irc.nick, sentAt: now, text: message});
                    irc.client.say(irc.to, irc.db.responses[util.rnd(0, irc.db.responses.length)]);
                } else {
                    console.log('Could not save not because base user does not exist or an error occured.');
                    irc.client.say(irc.to, 'I didn\'t send your shitty note.');
                    irc.client.say(irc.to, 'Maybe the alias does not exist for any base user. Use ' + config.fetchoperator + 'users and ' + config.fetchoperator + 'alias <base user> to check.');
                }
            } else {
                console.log('Error finding base user. ', err);
                irc.client.say(irc.to, 'I didn\'t send your shitty note.');
                irc.client.say(irc.to, 'Try again later maybe.');
            }
        });
    } else {
        irc.client.say(irc.to, 'Command usage: ' + config.executeoperator + 'note <alias> <message>.');
        irc.client.say(irc.to, 'Stores <message> for <alias>. When <alias> logs in and is active, the note will be delivered.');
    }
};

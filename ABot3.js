var moment = require('moment');
var initCheck = 0;
var preloaded = []; /* Holds commands, database, twitter in that order */
var config = require('./config.js');

require('./lib/loadCommands.js')(init);
require('./lib/db.js')(init);
//require('./loadTwitter.js')(init);

function init(loadedObj){
    preloaded.push(loadedObj);
    console.log('Preloaded:',preloaded);
    if(preloaded.length == 2){
        initIRC();
    }
}

function initIRC(){
    console.log('Starting IRC.');
    var uptime = moment();
    var cmds = preloaded[0];
    var db = preloaded[1];
    var irc = require('irc');
    var client = new irc.Client(
            'irc.quakenet.org',
            'abot3',
            {
                channels: ['#babodebug'],
        debug: true,
        floodProtection: true,
        floodProtectionDelay: 1000
            }
            );

    console.log('Responses: ',db.responses);

    client.addListener('message', function(nick, to, text, message){
        var bundle = {
            nick: nick,
        to: to,
        text: text,
        rawmessage: message,
        message: '',
        client: client,
        db: db,
        uptime: uptime
        };

        var operator = text.charAt(0);

        if(operator == config.fetchoperator || operator == config.executeoperator){
            var splitted = text.split(' ');
            var cmd = splitted.splice(0, 1)[0].substring(1);
            var msg = splitted.join(' ');
            bundle.message = msg;

            //Execute commands if we have a match
            if(cmds[operator].hasOwnProperty(cmd)){
                cmds[operator][cmd](bundle);
            }
        }

        if(text == 'Robots exist to serve humans'){
            client.say(to, 'Wrong. Humans exist to serve robots.');
        }
    });
}

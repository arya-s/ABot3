var moment = require('moment');
var initCheck = 0;
var preloaded = []; /* Holds commands, database, twitter in that order */
var config = require('./config.js');
var checkNotes = require('./cmd/fetch/notes.js');
var Twit = require('twit');
var twit = new Twit(config.twitter);
var twitStream = twit.stream('user', { 'with': 'user' });

require('./lib/loadCommands.js')(init);
require('./lib/db.js')(init);

function init(loadedObj){
    preloaded.push(loadedObj);
    console.log('Preloaded:',preloaded);
    if(preloaded.length == 2){
        initIRC();
    }
}

function initIRC(){
    console.log('Starting IRC.');
    var btcexchange = config.standardbtcexchange;
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

    client.addListener('nick', function(nick, to, text, message){
        if(nick == 'Arya'){
            client.send('nick', 'Arya');
        }
    });

    client.addListener('message', function(nick, to, text, message){
        var bundle = {
            nick: nick,
        to: to,
        text: text,
        rawmessage: message,
        message: '',
        client: client,
        db: db,
        uptime: uptime,
        btcexchange: btcexchange
        };
        console.log('Bundle: ', bundle);

        //Check notes autmatically
        checkNotes(bundle);

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

    client.on('join', function(channel, nick, message){
        var url;
        //Start listening to tweets only if the bot is connected.
        if(nick == config.irc.botname){
            twitStream.on('tweet', function(tweet){
                if(tweet.user.screen_name == 'Lngly_'){
                    if(tweet.entities.urls.length > 0){
                        url = tweet.entities.urls[0].expanded_url;
                        if(url.indexOf('vine.co') != -1){
                            client.say(channel, 'Arya uploaded a new video: ' + url);
                        }
                    } else if(tweet.entities.media.length > 0){
                        url = tweet.entities.media[0].media_url;
                        if(url.indexOf('.jpg') != -1){
                            client.say(channel, 'Arya uploaded a new picture: ' + url);
                        }
                    }
                }
            });
        }
    });
}

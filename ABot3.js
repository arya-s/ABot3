var moment = require('moment');
var initCheck = 0;
var preloaded = []; /* Holds commands, database, twitter in that order */
var config = require('./config.js');
var checkNotes = require('./cmd/fetch/notes.js');
var Twit = require('twit');
var twit = new Twit(config.twitter);
var twitStream = twit.stream('user', { 'with': 'user' });
var ObjectID = require('mongodb').ObjectID;
var botNameID = ObjectID('53597eda1ba435599e000016');

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
            db.botName,
            {
                channels: ['#babodebug'],
        debug: true,
        floodProtection: true,
        floodProtectionDelay: 1000
            }
            );

    console.log('Responses: ',db.responses);

        client.addListener('nick', function(nick, to, text, message){
        //Make sure to not accidentally trigger a self rename
        //Discard if the bot changed his name from Arya after !ohayou was sent
        if(message.nick == 'Arya' && message.user != '~nodebot'){
            client.send('nick', 'Arya');
            //And update the db with it in case the bot restarts
            db.setBotName(botNameID, 'Arya');
        }
    });

    client.addListener('quit', function(nick, reason, channels, message){
        if(message.nick == 'Arya'){
            client.send('nick', 'Arya');
            db.setBotName(botNameID, 'Arya');
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

        //Check notes autmatically
        checkNotes(bundle);

        var operator = text.charAt(0);
        if(operator == config.fetchoperator || operator == config.executeoperator){
            var splitted = text.split(' ');
            var cmd = splitted.splice(0, 1)[0].substring(1).toLowerCase();
            var msg = splitted.join(' ');
            bundle.message = msg;

            var isOwner = message.host.split('.')[0] == config.owner;

            //Execute commands if we have a match
            if(cmds[operator].hasOwnProperty(cmd)){
                if(cmds[operator][cmd].rights == 7){
                    if(isOwner){
                        cmds[operator][cmd].cmd(bundle);
                    } else {
                        client.say(to, 'You ain\'t tellin me no nothin, son.');
                    }
                } else if(cmds[operator][cmd].rights == 4){
                    cmds[operator][cmd].cmd(bundle);
                }
            }
        } else if(operator === '.'){
            bundle.db.addNewQuote('Test quote');
            console.log(bundle.db.getQuoteCount());
            bundle.db.addNewQuote('Test quote2');
            console.log(bundle.db.getQuoteCount());
        } else {
            //Fetch for youtube link if text happens to be one
            if(text.indexOf('youtu') != -1){
                bundle.message = text;
                cmds[config.fetchoperator].yt.cmd(bundle);
            }
        }


        if(text == 'Robots exist to serve humans'){
            client.say(to, 'Wrong. Humans exist to serve robots.');
        }

    });

    client.on('join', function(channel, nick, message){
        if(message.host.split('.')[0] == config.owner){
            db.setBotName(botNameID, config.irc.botname);
            client.send('nick', config.irc.botname);
        }

        if(message.user.indexOf("~nodebot") != -1){
            //Start listening to tweets only if the bot is connected.
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

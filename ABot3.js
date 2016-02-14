var moment     = require('moment');
var util       = require('./lib/util.js');
var handleLink = require('./lib/handleLink.js'); 
var initCheck  = 0;
var preloaded  = []; /* Holds commands, database, twitter in that order */
var config     = require('./config.js');
var checkNotes = require('./cmd/fetch/notes.js');
var Twit       = require('twit');
var twit       = new Twit(config.twitter);
var twitStream = twit.stream('user', { 'with': 'user' });
var ObjectID   = require('mongodb').ObjectID;
var botNameID  = ObjectID('53597eda1ba435599e000016');

require('./lib/loadCommands.js')(init);
require('./lib/db.js')(init);

function init(loadedObj) {

    preloaded.push(loadedObj);

    if (preloaded.length === 2) {
        initIRC();
    }

}

function initIRC()  {

    var btcexchange = config.standardbtcexchange;
    var uptime      = moment();
    var cmds        = preloaded[0];
    var db          = preloaded[1];
    var irc         = require('irc');
    var client      = new irc.Client(config.irc.server, db.botName, {
        channels: config.irc.channels,
        debug: config.irc.debug,
        floodProtection: true,
        floodProtectionDelay: 1000
    });

    client.addListener('message', function(nick, to, text, message) {

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

        if (operator === config.fetchoperator || operator === config.executeoperator) {

            var splitted = text.split(' ');
            var cmd      = splitted.splice(0, 1)[0].substring(1).toLowerCase();
            var msg      = splitted.join(' ');
            var isOwner  = (message.host.split('.')[0] === config.owner);

            bundle.message = msg;

            var commands = cmds[operator];

            //Execute commands if we have a match
            if (cmds[operator].hasOwnProperty(cmd)) {

                if (cmds[operator][cmd].rights == 7) {

                    if (isOwner) {
                        cmds[operator][cmd].cmd(bundle);
                    } else {
                        client.say(to, 'You ain\'t tellin me no nothin, son.');
                    }

                } else if (cmds[operator][cmd].rights == 4) {
                    cmds[operator][cmd].cmd(bundle);
                }
                
            }

        } else {

            //Fetch for youtube link if text happens to be one
            if (text.indexOf('youtu') !== -1) {

                bundle.message = text;
                cmds[config.fetchoperator].yt.cmd(bundle);

            } else if (message.user.indexOf("~nodebot") === -1 && util.isUrl(text)) {

                var url = util.getUrl(text);

                bundle.message = url;
                handleLink(bundle);

            }

        }


        if (text === 'Robots exist to serve humans') {
            client.say(to, 'Wrong. Humans exist to serve robots.');
        }

    });

    client.on('join', function(channel, nick, message) {

        if (message.user.indexOf("~nodebot") !== -1) {

            var url;

            //Start listening to tweets only if the bot is connected.
            twitStream.on('tweet', function(tweet){

                if (tweet.user.screen_name === 'Lngly_') {

                    if (tweet.entities.urls.length > 0) {

                        url = tweet.entities.urls[0].expanded_url;

                        if (url.indexOf('vine.co') !== -1) {
                            client.say(channel, 'Arya uploaded a new video: ' + url);
                        }

                    } else if (tweet.entities.media.length > 0) {

                        url = tweet.entities.media[0].media_url;

                        if (url.indexOf('.jpg') !== -1) {
                            client.say(channel, 'Arya uploaded a new picture: ' + url);
                        }

                    }

                }

            });

        }

    });

}

var esc = require('escape-html');

module.exports = function(irc){
    var msg = esc(irc.message);
    var splitted = msg.split(' ');
    var link = splitted.splice(0, 1)[0];
    var desc = splitted.join(' ');

    if((link.indexOf('http://') != -1 || link.indexOf('https://') != -1 || link.indexOf('www.') != -1)){
        if(link.indexOf('http://') == -1 && link.indexOf('https://') == -1){
            link = 'http://'+link;
        }

        irc.db.addLink(link, desc, irc.nick, function(err){
            if(!err){
                irc.client.say(irc.to, 'Added your shitty waste of space link.');
            } else {
                irc.client.say(irc.to, 'I didn\'t feel like saving your worthless link. Try again maybe, I don\'t know.');
            }
        });
    } else {
        irc.client.say(irc.to, 'That\'s not a valid URL. No funny business.');
    }
};

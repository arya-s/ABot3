var moment = require('moment');
var config = require('../../config.js');
var UPTIME_MAX_DAYS = 1;


module.exports = function(irc){

    var splitted = irc.message.split(' ');

    if (splitted.length < 2) {

        irc.client.say(irc.to, 'Command usage: ' + config.executeoperator + 'reminder <(d+)d(d+)h(d+)m(d+)s> <message>. e.g. ' + config.executeoperator + 'reminder 4m20s tea is ready');
        irc.client.say(irc.to, 'Reminds you of a <message> after <(d+)d(d+)h(d+)m(d+)s> from now.');
        return;

    }

    var time     = splitted.splice(0, 1)[0];
    var message  = splitted.join(' '); 
    var duration = getDuration(time);

    if (typeof duration === 'undefined') {

        irc.client.say(irc.to, 'Error parsing ' + time + '.');
        return;

    }

    var now      = moment();
    var reminder = {
        sender: irc.nick,
        sentAt: now.toDate(),
        dueAt: moment(now).add(duration).toDate(),
        ago: time,
        message: message
    };

    irc.db.addReminder(reminder, function (error) {

        if (error) {

            irc.client.say(irc.to, 'Error saving your reminder. Please try again.');
            return;

        }

        irc.client.say(irc.to, 'Saved your reminder.');

        // Uptime is never larger than a day
        // We don't need to keep timeout track for dates that are more than two days into the future
        if (moment(reminder.dueAt).diff(now, 'days') <= (UPTIME_MAX_DAYS + 1)) { 

            global.setTimeout(function () {

                irc.client.say(irc.to, reminder.sender + ': ' + reminder.message);
                irc.client.say(irc.to, 'Set ' + reminder.ago + ' ago.'); 

                irc.db.removeReminder(reminder);

            }, duration.as('milliseconds'));

        }

    });

};

function getDuration (time) {

    if (typeof time !== 'string') {
        return;
    }

    var matched = [
        extract(time, 'd'),
        extract(time, 'h'),
        extract(time, 'm'),
        extract(time, 's')
    ];

    // Filter out missing matches
    matched = matched.filter(function (element) {
        return element !== null;
    });

    // Return if nothing was matched
    if (matched.length === 0) {
        return;
    }

    var duration = moment.duration(matched[0].amount, matched[0].modifier);
    for (var i = 1; i < matched.length; i++) {

        var match = matched[i];
        duration.add(match.amount, match.modifier);

    }

    return duration;

}

function extract (time, modifier) {

    var parsed = time.match(new RegExp('\\d+' + modifier));

    if (parsed === null) {
        return null;
    }

    var amount = Number(parsed[0].match(/\d+/));

    return {modifier: modifier, amount: amount};

}

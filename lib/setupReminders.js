var moment = require('moment');
var UPTIME_MAX_DAYS = 1;


module.exports = function (irc) {

	irc.db.getReminders(function (error, data) {

		if (error) {

			console.log('Error retrieving reminders.', error);
			return;

		}

		for (var i = 0; i < data.length; i++) {

			var reminder = data[i];
			var dueAt	 = moment(reminder.dueAt);
			var duration = dueAt.diff(moment());

			// Uptime is never larger than a day
			// We don't need to keep timeout track for dates that are more than two days into the future
			if (dueAt.diff(moment(), 'days') <= (UPTIME_MAX_DAYS + 1)) { 
				processReminder(reminder, duration);
			}

		}

    });

	function processReminder(reminder, duration) {

		global.setTimeout(function() {

			irc.client.say(irc.to, reminder.sender + ': ' + reminder.message);
			irc.client.say(irc.to, 'Set ' + reminder.ago + ' ago.');

			irc.db.removeReminder(reminder);

		}, duration);

    }

};

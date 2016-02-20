var moment = require('moment');


module.exports = function (irc) {

	irc.db.getReminders(function (error, data) {

		if (error) {

			console.log('Error retrieving reminders.', error);
			return;

		}

		for (var i = 0; i < data.length; i++) {

			var reminder = data[i];
			var duration = moment(reminder.dueAt).diff(moment());

			global.setTimeout(function () {

				irc.client.say(irc.to, reminder.sender + ': ' + reminder.message);
				irc.client.say(irc.to, 'Set ' + reminder.ago + ' ago.'); 

				irc.db.removeReminder(reminder);

			}, duration);

		}

    });

};

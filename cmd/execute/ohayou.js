var config = require('../../config.js');
var ObjectID = require('mongodb').ObjectID;
var botNameID = ObjectID('53597eda1ba435599e000016');

module.exports = function(irc){
    irc.db.setBotName(botNameID, config.irc.botname);
    irc.client.send('nick', config.irc.botname);
};

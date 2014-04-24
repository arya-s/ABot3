var config = require('../../config.js');

module.exports = function(irc){
    irc.client.send('nick', config.irc.botname);
}

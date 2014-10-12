var util = require('../../lib/util.js');

module.exports = function(irc){
    var quote = util.trim(irc.message);
    console.log(quote.length);

    if(quote.length > 0){
        irc.db.addNewQuote(quote, function(err, id){
           if(!err){
               irc.client.say(irc.to, 'Added your shitty quote as quote #', id);
           } else {
               irc.client.say(irc.to, 'Something went wrong, try again later, or don\'t, I don\'t care.');
           }
        });
    } else {
        irc.client.say(irc.to, 'Very funny. Don\'t add empty quotes.');
    }
};

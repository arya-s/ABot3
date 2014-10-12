var util = require('../../lib/util.js');

module.exports = function(irc){
    var quoteId = util.trim(irc.message);

    if(quoteId.length > 0){
        //Fetch quote by id
        irc.db.getQuoteWithId(parseInt(quoteId), function(err, data){
            if(!err){
                console.log(data);

                if(data.length > 0){
                    irc.client.say(irc.to, 'Quote #' + quoteId + ': ' + data[0].quote);
                }
            } else {
                console.warn(err.message);
            }
        });
    } else {
        //Fetch a random quote
        irc.db.getQuoteCount(function(err, stats){
            if(!err){
                var quoteCount = stats.count;
                var randomId = util.rnd(1, quoteCount);

                console.log('Random quote id: ' + randomId);

                irc.db.getQuoteWithId(randomId, function(err, data){
                    if(!err){
                        if(data.length > 0){
                            console.log(data);

                            irc.client.say(irc.to, 'Quote #' + randomId + ': ' + data[0].quote);
                        }
                    } else {
                        console.warn(err.message);
                    }
                });
            }
        });
    }

};

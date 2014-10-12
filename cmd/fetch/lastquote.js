module.exports = function(irc){
    irc.db.getQuoteCount(function(err, stats){
        if(!err){
            var maxId = stats.count;

            irc.db.getQuoteWithId(maxId, function(err, data){
                if(!err){
                    if(data.length > 0){
                        irc.client.say(irc.to, 'Quote #' + maxId + ': ' + data[0].quote);
                    }
                }
            });
        }
    });
};

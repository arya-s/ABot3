var express = require('express');
var config = require('./config.js');
var moment = require('moment');
var db = require('./lib/db.js')(init);

function init(db){
    var app = express();

    app.get('/', function(request, response){
        //Quick n dirty
        db.fetchLinksForWeb(function(err, data){
            if(!err){
                var out = '';

                data.forEach(function(link){
                    out += '<p><a href="' + link.url + '" target="_blank">' + link.url + '</a>';

                    if(link.description.length > 0){
                        out += '<br />' + link.description + '<br />';
                    }

                    out += ' by ' + link.sender + ' ' + moment(link.sentAt).fromNow() + '.</p>';
                });

                response.send(out);
            } else {
                console.log('Could not retrieve links. ', err);
            }
        });
    });

    var port = process.env.PORT || 5000;
    app.listen(port, function(){
        console.log('Listening on port: ' + port);
    });

    //Start the irc bot
    require('./ABot3.js');
}

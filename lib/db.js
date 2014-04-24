var mongodb = require('mongodb');
var config = require('../config.js');

module.exports = function(cb){
    mongodb.connect(config.db, function(err, db){
        if(err){
            throw err;
        }

        var responses = [];
        db.collection('responses').find().toArray(function(err, data){
            if(!err){
                if(data.length > 0){
                    responses = data[0].all;
                }
            }

            cb(new Database(db, responses));
        });
    });
};

function Database(db, responses){
    this.db = db;
    this.responses = responses;
}

Database.prototype.fetchLinks = function(cb){
    this.db.collection('links').find().sort({ sentAt: -1}).limit(3).toArray(function(err, data){
        if(err){
            cb(err);
        } else {
            //IRC scrolls so give back the newest link last
            data.sort(function(a, b){
                return (a.sentAt > b.sentAt) ? 1 : ((b.sentAt > a.sentAt) ? -1 : 0);
            });

            cb(null, data);
        }
    });
};

Database.prototype.addLink = function(link, desc, sender, cb){
    this.db.collection('links').insert({ url: link, description: desc, sender: sender, sentAt: Date.now() }, { safe: true}, function(err, records){
        cb(err);
    });
};

Database.prototype.getUser = function(user, cb){
    this.db.collection('users').find({ name: user }).toArray(function(err, data){
        cb(err, data);
    });
};

Database.prototype.updateUser = function(user, alias){
    this.db.collection('users').update({ name: user}, { '$addToSet': { aliases: alias } }, { w: 0 });
};

Database.prototype.getUsers = function(cb){
    this.db.collection('users').find().toArray(function(err, data){
        cb(err, data);
    });
};

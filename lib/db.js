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

            db.collection('bouncer').find().toArray(function(err, data){
                if(!err){
                    if(data.length > 0){
                        var botName = data[0].curBotName;
                        cb(new Database(db, responses, botName));
                    } else {
                        cb(new Database(db, responses, config.irc.botname));
                    }
                } else {
                    console.log('Error: Could not retrieve botname.',err);
                }
            });
        });
    });
};

function Database(db, responses, botName){
    this.db = db;
    this.responses = responses;
    this.botName = botName;
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

Database.prototype.fetchLinksForWeb = function(cb){
    this.db.collection('links').find().sort({ sentAt: -1 }).toArray(function(err, data){
        cb(err, data);
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

Database.prototype.getUserForAlias = function(alias, cb){
    this.db.collection('users').find({ aliases: { '$in': [alias] } }).toArray(function(err, data){
        cb(err, data);
    });
};

Database.prototype.addNote = function(user, note){
    this.db.collection('notes').update({ user: user }, { '$push': { notes: note } }, { w: 0});
};

Database.prototype.getNotesForUser = function(user, cb){
    this.db.collection('notes').find({ user: user }).toArray(function(err, data){
        cb(err, data);
    });
};

Database.prototype.resetNotes = function(user){
    this.db.collection('notes').update({ user: user}, { '$set': { notes: [] } }, { w: 0});
};

Database.prototype.getBotName = function(cb){
    this.db.collection('bouncer').find().toArray(function(err, data){
        cb(err, data);
    });
};

Database.prototype.setBotName = function(id, name){
    this.db.collection('bouncer').update({ _id: id}, { curBotName: name }, { w: 0});
};

Database.prototype.getIdFor = function(name){
    this.db.collection('idcounters').findAndModify({ _id: name }, {}, { $inc: { count: 1 } }, { new: true }, function(err, rec){
        if(err){
            console.warn(err.message);
        } else {
            return rec.count;
        }
    });
};

Database.prototype.addNewQuote = function(quote){
    this.db.collection('quotes').insert({ _id: this.getIdFor('quotes'), quote: quote }, { w: 0 });
};

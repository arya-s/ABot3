//DB String
exports.db = 'mongodb://<user>:<password>@<host>:<port>/<appname>';

//IRC config
exports.irc = {
    botname: 'bot',
    channels: ['#channelname'],
    debug: false
};

//Twitter config
exports.twitter = {
    access_token: '<access_token>',
    access_token_secret: '<access_token_secret>',
    consumer_key: '<consumer_key>',
    consumer_secret: '<consumer_secret>'
};
exports.twitterHandle = '<twitter username>';

//MISC
exports.fetchoperator = '?';
exports.executeoperator = '!';

//BTC
exports.standardbtcexchange = 'bitstamp';
exports.currentbtcexchange = 'bitstamp';
exports.setBtcexchange = function(exchange){
    this.currentbtcexchange = exchange;
};

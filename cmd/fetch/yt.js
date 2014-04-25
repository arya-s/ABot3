var util = require('../../lib/util.js');
var config = require('../../config.js');
var getYoutubeID = require('get-youtube-id');
var youtube = require('youtube-node');
youtube.setKey(config.youtube.key);

module.exports = function(irc){
    youtube.getById(getYoutubeID(irc.message), function(result){
        var videoTitle = result.items[0].snippet.title;
        var durationString = util.convertTime(result.items[0].contentDetails.duration);
        var channelTitle = result.items[0].snippet.channelTitle;
        var likes = result.items[0].statistics.likeCount;
        var dislikes = result.items[0].statistics.dislikeCount;
        var viewCount = result.items[0].statistics.viewCount;

        irc.client.say(irc.to, videoTitle + ' (' + durationString + ') by ' + channelTitle + ' [+' + likes + '/-' + dislikes + ', ' + viewCount + ' views]'); 
    });
};

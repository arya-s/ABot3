var util = require('../../lib/util.js');
var config = require('../../config.js');
var getYoutubeID = require('get-youtube-id');
var YouTube = require('youtube-node');
var youtube = new YouTube();

youtube.setKey(config.youtube.key);

module.exports = function(irc){
    var id = getYoutubeID(irc.message);
    if(id){
        youtube.getById(id, function(result){
            if(result){
                var videoTitle = result.items[0].snippet.title;
                var durationString = util.convertTime(result.items[0].contentDetails.duration);
                var channelTitle = result.items[0].snippet.channelTitle;
                var likes = result.items[0].statistics.likeCount;
                var dislikes = result.items[0].statistics.dislikeCount;
                var viewCount = result.items[0].statistics.viewCount;

                irc.client.say(irc.to, '[Y] ' + videoTitle + ' (' + durationString + ') by ' + channelTitle + ' [+' + likes + '/-' + dislikes + ', ' + viewCount + ' views]'); 
            }
        });
    }
};

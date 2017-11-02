


var Twitter = require('twitter');

var command = process.argv[2];
var value;
if(process.argv.length > 3) value = process.argv[3];

switch (command){
    case "my-tweets":
        getMyTweets();
        break;
    case "spotify-this-song":
        break;
    case "movie-this":
        break;
    case "do-what-it-says":
        break;
}

function getMyTweets(){

    var twitterKeys = require("./twitter_keys.js");
    
   var client = new Twitter({
     consumer_key: twitterKeys.consumer_key,
     consumer_secret: twitterKeys.consumer_secret,
     access_token_key: twitterKeys.access_token_key,
     access_token_secret: twitterKeys.access_token_secret
   });
    
   var params = {screen_name: 'Tony Habash'};
   client.get('statuses/user_timeline', params, function(error, tweets, response) {
     if (!error) {
       console.log(tweets);
        var tweet;
       for(i = 0; i < tweets.length; i++){
            tweet = tweets[i];
            console.log("");
            console.log("Tweet# " + (i + 1));
            console.log(tweet.user.name);
            console.log(tweet.created_at);
            console.log(tweet.text);
            console.log("");
       }
     }
   });
}

function spotifySong(){

    if(process.argv.length>= 4){
        var songName = process.argv[3];
        var spotifyKeys = require("./spotify_keys");
        var Spotify = require('node-spotify-api');
        
       var spotify = new Spotify({
         id: spotifyKeys.client_id,
         secret: spotifyKeys.client_secret
       });
        
       spotify.search({ type: 'track', query: songName }, function(err, data) {
         if (err) {
           return console.log('Error occurred: ' + err);
         }else{
            console.log(data); 
        }
       });

    }else{
        console.log("No song input detected.")
    }

}
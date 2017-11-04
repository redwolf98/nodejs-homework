


var Twitter = require('twitter');

var command = process.argv[2];
var value;
if(process.argv.length > 3) value = process.argv[3];

switch (command){
    case "my-tweets":
        getMyTweets();
        break;
    case "spotify-this-song":
        spotifySong(value);
        break;
    case "movie-this":
        findMovie(value);
        break;
    case "do-what-it-says":
        readAndExecute();
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
    //    console.log(tweets);
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

function spotifySong(songName){

    if(songName == null){
        songName = "The Sign by Ace of Base";
    }else if(songName.length === 0){
        songName = "The Sign by Ace of Base"; 
    }
        songName = toTitleCase(songName);
        songName = songName.replace('"','');
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
            
            var artists = "";
            var previewLink = "";
            var albumName = "";
            
            if(data.tracks.items.length > 0){
              
               var album = data.tracks.items[0].album;
              for(i=0;i<album.artists.length;i++){
                    if(artists.length > 0) artists += ", "
                    artists += album.artists[i].name;
              }

              previewLink = album.external_urls.spotify;
              albumName =  album.name;
              songName = songName.replace(" By Ace Of Base","");
              console.log("");
              console.log('Song: "' + songName + '"');
              console.log('Artists: ' + artists);
              console.log('Preview Link: ' + previewLink );
              console.log('Album: "' + albumName + '"');
              
        //    console.log(JSON.stringify(album, undefined, 2)); 
            }else{
                //Use default song information here.
                console.log("Song not found");
            }
            

        }
       });



}


function findMovie(movieName){
    
        if(movieName == null ){
            movieName = "Mr. Nobody!";
        }else if(movieName.length === 0){
            movieName = "Mr. Nobody!";
        }
            var movieName = toTitleCase(movieName);
            movieName = movieName.replace('"','');
            var request = require("request");
            movieName = movieName.replace(" ","+");
            
            // We then run the request module on a URL with a JSON
            request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&apikey=40e9cece", function(error, response, body) {
            
              // If there were no errors and the response code was 200 (i.e. the request was successful)...
              if (!error && response.statusCode === 200) {
            
                //console.log(response); // This will show the entire response object
            
                // Then we print out the imdbRating
                // console.log("The movie's rating is: " + JSON.parse(body).imdbRating); // Shows only the rating
                body = JSON.parse(body);
                var imdbRating = "None";
                var rottenTomatoesRating = "None";

                for(i=0;i<body.Ratings.length;i++){
                    if(body.Ratings[i].Source === "Internet Movie Database") imdbRating = body.Ratings[i].Value;
                    if(body.Ratings[i].Source === "Rotten Tomatoes") rottenTomatoesRating = body.Ratings[i].Value;
                }


                console.log("* " + body.Title);
                console.log("* " + body.Year);
                console.log("* IMDB Rating: " + imdbRating);
                console.log("* Rotten Tomatoes Rating: " + rottenTomatoesRating);
                console.log("* " + body.Country);
                console.log("* " + body.Language);
                console.log("* " + body.Plot);
                console.log("* " + body.Actors);

                // console.log(JSON.stringify(JSON.parse(body),undefined,2)); // Shows the entire response from the API call
              }
            });
    
       
    
    }
    
    function readAndExecute(){
        var fs = require("fs");

        fs.readFile('./random.txt', 'utf8', function(err, data) { // Param 1: filename, param 2: encoding, param 3: callback function
    
        if (err) { // If something broke
            return console.log(err);
        }
        
        var array = data.split(','); // Split the string into an array (this removes the commas and spaces at the same time)
       
       
        var command = array[0];
        var value = "";
        if(array.length > 1) value = array[1];
        console.log("Command: " + command);
        console.log("Value: " + value);
        switch (command){
            case "my-tweets":
                getMyTweets();
                break;
            case "spotify-this-song":
                spotifySong(value);
                break;
            case "movie-this":
                findMovie(value);
                break;
            case "do-what-it-says":
                readAndExecute();
                break;
        }
        
        });
    }


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
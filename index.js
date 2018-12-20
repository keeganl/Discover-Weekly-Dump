const SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: "baf66a9db8d34ca48e2e860c120de0a4",
  clientSecret: "52f993759d694b2aac17e663dea4e9c0",
  redirectUri: "http://www.example.com/callback"
});

// Passing a callback - get Elvis' albums in range [20...29]
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    // Passing a callback - get Elvis' albums in range [20...29]
    // spotifyApi.getUser("222z3mnymzxnx2b5m6yj5vtri")
    // .then(function(data) {
    //     console.log("Some information about this user", data.body);
    //   }, function(err) {
    //     console.log("Something went wrong!", err);
    //   });
    spotifyApi
      .getPlaylist("37i9dQZEVXcEFGwy4vib4y")
      .then(
        function(data) {
          //console.log("Retrieved playlists", data.body);
          //console.log(data.body.items[0].tracks);
          for (const i of data.body.tracks.items) {
            console.log(`${i.track.name}`);
            console.log(`${i.track.href}\n`);
            
          }
          
        },
        function(err) {
          console.log("Something went wrong!", err);
        }
      );
  });

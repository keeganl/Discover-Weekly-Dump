const SpotifyWebApi = require("spotify-web-api-node");
var cron = require("node-cron");

var spotifyApi = new SpotifyWebApi({
  clientId: "baf66a9db8d34ca48e2e860c120de0a4",
  clientSecret: "52f993759d694b2aac17e663dea4e9c0",
  redirectUri: "http://www.example.com/callback"
});

spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    var tracks = []
    spotifyApi
      .getPlaylist("37i9dQZEVXcEFGwy4vib4y")
      .then(
        function(data) {
          for (const i of data.body.tracks.items) {
            console.log(`${i.track.name}`);
            console.log(`${i.track.uri}`);
            console.log(`${i.track.href}\n`);
            tracks.push(i.track.uri);
          }
          return tracks;
        }, function(err) {
        console.log("Something went wrong!", err);
      })
      .then(
        // 4pTSMdTFjdf4R4K71WHTwI
        function(tracks) {
          console.log(tracks)
          return tracks.forEach(track => {
            spotifyApi.addTracksToPlaylist('4pTSMdTFjdf4R4K71WHTwI', tracks)
              .then(function (data) {
                console.log(`Added ${data} to playlist!`);
              }, function (err) {
                console.log('Something went wrong!', err);
              });
          });
      }) 
  });

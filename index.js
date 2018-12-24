const SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: "baf66a9db8d34ca48e2e860c120de0a4",
  clientSecret: "8426e3f40dc441369615fbb7aac1e0e3",
});

var tracks = [];

// Passing a callback - get Elvis' albums in range [20...29]
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi
      .getPlaylist("37i9dQZEVXcEFGwy4vib4y")
      .then(function (data) {
        // console.log("Retrieved playlists", data.body);
        // console.log(data.body.items[0].tracks);
        for (const i of data.body.tracks.items) {
          console.log(`${i.track.name}`);
          console.log(`${i.track.uri}`);
          console.log(`${i.track.href}\n`);
          tracks.push(i.track.uri);
        }
        return tracks;
      }, function (err) {
        console.log("Something went wrong!", err);
      }, function (err) {
        console.log(err);
      })
      .then(// 4pTSMdTFjdf4R4K71WHTwI
        function (tracks) {
          return tracks.forEach(track => {
            // console.log(track);
            spotifyApi.addTracksToPlaylist("4pTSMdTFjdf4R4K71WHTwI", track, function (err) {
              console.log(err);
            }).then(() => {
              console.log("success")
            }, function (err) {
              console.log(err);
            });
          });
        })  
})


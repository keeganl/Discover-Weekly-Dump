const SpotifyWebApi = require("spotify-web-api-node");
const readline = require("readline");

var tracks = [];


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var scopes = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public"
];

var state = "";

var spotifyApi = new SpotifyWebApi({
  clientId: "baf66a9db8d34ca48e2e860c120de0a4",
  clientSecret: "8426e3f40dc441369615fbb7aac1e0e3",
  redirectUri: "https://example.com/callback"
});
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);

console.log("Open that url in a browser and paste the result below:");

rl.question("", loc => {
  var a = loc.split("code=")
  var b = a[1].split('&state=')
  let code = b[0];
  console.log(`${code}`);

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      spotifyApi
        .getPlaylist("37i9dQZEVXcEFGwy4vib4y")
        .then(function (data) {
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
          }
      ).then(// 4pTSMdTFjdf4R4K71WHTwI
        function (tracks) {
          spotifyApi
            .addTracksToPlaylist(
              "4pTSMdTFjdf4R4K71WHTwI",
              tracks,
              function (err) {
                console.log(err);
              }
            )
        })  
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );

  //open.spotify.com/playlist/4pTSMdTFjdf4R4K71WHTwI?si=EKALJTRrQ8-DAFnpJp4fKw

  rl.close();
});


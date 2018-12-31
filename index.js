require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const figlet = require('figlet')
const cron = require('node-cron');
// cron schedule is: 
// 0 12 * * 1
const readline = require("readline");
const puppeteer = require("puppeteer");



figlet.text(
  "Spotify Dump",
  {
    font: "Doom",
    horizontalLayout: "default",
    verticalLayout: "default"
  },
  function(err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  }
);

// figlet.fonts(function (err, fonts) {
//   if (err) {
//     console.log('something went wrong...');
//     console.dir(err);
//     return;
//   }
//   console.dir(fonts);
// });

var tracks = [];
var url = "";
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
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
// console.log(authorizeURL);

// console.log("Open that url in a browser and paste the result below:");

(async () => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(authorizeURL);
  await sleep(2000);
  await page.click(".btn-facebook");
  await sleep(2000);
  await page.focus("#email");
  page.keyboard.type(process.env.USERNAME);
  await sleep(2000);
  await page.focus("#pass");
  page.keyboard.type(process.env.PASSWORD);
  await sleep(1000);
  await page.click("#loginbutton");
  await sleep(3000);
  url = await page.url();
  await browser.close();

  // rl.question("", loc => {
  var a = url.split("code=");
  var b = a[1].split("&state=");
  let code = b[0];
  console.log(`${code}`);

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);

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
          },
          function(err) {
            console.log("Something went wrong!", err);
          },
          function(err) {
            console.log(err);
          }
        )
        .then(
          // 4pTSMdTFjdf4R4K71WHTwI
          function(tracks) {
            spotifyApi.addTracksToPlaylist(
              "4pTSMdTFjdf4R4K71WHTwI",
              tracks,
              function(err) {
                console.log(err);
              }
            );
          }
        );
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );

  //open.spotify.com/playlist/4pTSMdTFjdf4R4K71WHTwI?si=EKALJTRrQ8-DAFnpJp4fKw

  // rl.close();
  // });
})();

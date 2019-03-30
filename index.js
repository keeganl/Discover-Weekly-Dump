require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const figlet = require('figlet')
const cron = require('node-cron');
const puppeteer = require("puppeteer");
var menubar = require("menubar");

var mb = menubar();
mb.setOption("width", 0);
mb.setOption("height", 0);
mb.setOption("icon", `${__dirname}/icon.png`);
mb.on("ready", () => {
  cron.schedule("0 12 * * 1", () => {
    figlet.text(
      "Spotify Dump",
      {
        font: "Doom",
        horizontalLayout: "default",
        verticalLayout: "default"
      },
      function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        console.log(data);
      }
    );

    var tracks = [];
    var url = "";
    var state = "";
    var scopes = [
      "playlist-read-private",
      "playlist-modify-private",
      "playlist-modify-public"
    ];

    var spotifyApi = new SpotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI
    });

    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    (async () => {

      const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      // logging into Spotify to give permissions
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

      // grabbing the code from the response URL
      var a = url.split("code=");
      var b = a[1].split("&state=");
      let code = b[0];
      console.log(`${code}`);

      // Retrieve an access token and a refresh token
      spotifyApi.authorizationCodeGrant(code).then(
        function (data) {
          console.log("The token expires in " + data.body["expires_in"]);
          console.log("The access token is " + data.body["access_token"]);
          console.log("The refresh token is " + data.body["refresh_token"]);

          // Set the access token on the API object to use it in later calls
          spotifyApi.setAccessToken(data.body["access_token"]);
          spotifyApi.setRefreshToken(data.body["refresh_token"]);

          spotifyApi
            // getting my Discover Weekly playlist
            .getPlaylist("37i9dQZEVXcEFGwy4vib4y")
            .then(
              (data) => {
                // looping to get track names, URI's, and href's
                for (const i of data.body.tracks.items) {
                  console.log(`${i.track.name}`);
                  console.log(`${i.track.uri}`);
                  console.log(`${i.track.href}\n`);
                  tracks.push(i.track.uri);
                }
                return tracks;
              },
              (err) => {
                console.log("Something went wrong!", err);
              }
            )
            .then(
              // ID of playlist I want to dump into
              // 4pTSMdTFjdf4R4K71WHTwI
              (tracks) => {
                spotifyApi.addTracksToPlaylist(
                  "4pTSMdTFjdf4R4K71WHTwI",
                  tracks,
                  function (err) {
                    console.log(err);
                  }
                );
              }
            );
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
    })();
  });
});



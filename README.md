# Discover-Weekly-Dump
### Only supports OSX for now
### To configure: 

```
npm install
```
Then create an ```env``` file that has your spotify app credentials and then configure the Puppeteer setup for your login needs. In my case I had my Spotify account setup through Facebook so I just use my credentials for that. You can do the same for the Spotify login by getting the id's for those fields and the login button. 

You will also need to point the api to your playlists that you want to copy to and from.

### To package: 

You can use the command ```npm run package-mac``` then the application will be in the release-builds folder in your directory. You can move this where ever you like. 
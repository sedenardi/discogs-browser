discogs-browser
===============

This program will download a user's entire inventory, group by artist, and sort them. This is an easier way to see someone's entire inventory rather than paging through potentially tens or hundreds of pages.

### Dependencies

discogs-browser uses express, disconnect, and underscore. You also must register an app with Discogs [here](https://www.discogs.com/settings/developers) and write down its `consumer key` and `consumer secret`. This isn't strictly necessary for the API call we're using, but it's a good idea if you plan on doing further development with the Discogs API.

### Setup

- Check out the repo and install it using `npm install`. 
- Edit the `config.json` to include your `consumerKey` and `consumerSecret` of your application you registered with Discogs.
- Start the program with `node discogs-browser` and navigate your browser to `http://localhost:3001/auth' to authenticate the app.
- Once authentication is done, begin downloading a user's inventory by going to `/inventory?user={username}`. This will start the downloading of the user's inventory.
- Monitor the progress by either looking at the console output or by going to `/fetch?user={username}`. Once it's done, go to this page again and you'll see an alphabetized list of the artists the user has in their inventory, as well as albums grouped by artist.
- The app will also save the downloaded inventory to a file `{username}.json` on the root directory for later reference.

License
-------
The MIT License (MIT)

Copyright (c) 2014 Sanders DeNardi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

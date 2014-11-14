var Discogs = require('disconnect').Client,
    express = require('express'),
    _und = require('underscore'),
    fs = require('fs');

var configFile = './config.json';
var config = require(configFile);

var writeConfig = function(callback) {
  console.log('Writing config');
  fs.writeFile(configFile, JSON.stringify(config,null,2), function(err) {
    if (err) {
      console.log('Error writing config');
    } else {
      console.log('Done writing config');
      callback();
    }
  });
};

var baseUrl = 'http://localhost:3001';
var inventories = {};
var app = express();

var reqData;
var accData = config.discogs.accessData;
var market;
if (typeof accData !== 'undefined') {
  market = new Discogs(accData).marketplace();
}

app.get('/auth', function(req, res) {
  if (typeof accData !== 'undefined') {
    res.send('Already have access token');
    return;
  }
  var dis = new Discogs();
  dis.getRequestToken(
    config.discogs.consumerKey,
    config.discogs.consumerSecret,
    baseUrl + config.discogs.callbackUrl,
    function(err, requestData) {
      reqData = requestData;
      console.log('Request Data');
      console.log(JSON.stringify(requestData));
      res.redirect(requestData.authorizeUrl);
    }
  );
});

app.get(config.discogs.callbackUrl, function(req, res) {
  var dis = new Discogs(reqData);
  dis.getAccessToken(
    req.query.oauth_verifier,
    function(err, accessData) {
      accData = accessData;
      console.log('Access Data');
      console.log(JSON.stringify(accessData));
      config.discogs.accessData = accessData;
      writeConfig(function() {
        res.send('Received access token!.');
      });
    }
  );
});

app.get('/inventory', function(req, res) {
  if (typeof market === 'undefined') {
    res.send('Must auth first');
    return;
  }
  if (typeof inventories[req.query.user] !== 'undefined') {
    res.send('Already fetching/fetched.');
    return;
  }
  getInventory(req.query.user,1);
  res.send('Started fetching inventory');
});

var getInventory = function(user, page) {
  console.log('Fetching page ' + page + ' of ' + user + '\'s inventory');
  market.inventory(user, { page: page, per_page: 100 }, function(err, data) {
    if (err) {
      console.log(err);
      getInventory(user, page);
      return;
    }
    if (typeof inventories[user] === 'undefined') {
      inventories[user] = {
        fetching: true,
        listings: []
      };
    }
    Array.prototype.push.apply(inventories[user].listings, data.listings);
    inventories[user].page = data.pagination.page;
    inventories[user].pages = data.pagination.pages;
    if (page < data.pagination.pages) {
      process.nextTick(function() {
        getInventory(user, page + 1);
      });
    } else {
      console.log('Done fetching ' + user + '\'s inventory, processing');
      processInventory(user);
      console.log('Done processing ' + user + '\'s inventory, writing to file');
      inventories[user].fetching = false;
      var filename = './' + user + '.json';
      fs.writeFile(filename, JSON.stringify(inventories[user],null,2), function(err) {
        if (err) {
          console.log('Error writing user file');
        } else {
          console.log('Done writing user file');
        }
      });
    }
  });
};

var processInventory = function(user) {
  var grouped = _und.groupBy(inventories[user].listings, function(d) {
    return d.release.description.split('-')[0].trim();
  });
  var artists = [];
  var groups = [];
  for (var field in grouped) {
    var titles = [];
    for (var i = 0; i < grouped[field].length; i++) {
      titles.push(grouped[field][i].release.description);
    }
    artists.push(field);
    groups.push({
      artist: field,
      titles: titles
    });
  }
  var sortedArtists = _und.sortBy(artists, function(d) { return d; });
  var sortedGroups = _und.sortBy(groups, function(d) { return d.artist; });
  inventories[user].artists = sortedArtists;
  inventories[user].groups = sortedGroups;
};

app.get('/fetch', function(req, res) {
  if (typeof inventories[req.query.user] === 'undefined') {
    res.send('Havent\'t started fetching inventory');
    return;
  }
  if (inventories[req.query.user].fetching) {
    res.send('Fetching ' + inventories[req.query.user].page + '/' + inventories[req.query.user].pages + ' pages');
  } else {
    res.json({
      artists: inventories[req.query.user].artists,
      groups: inventories[req.query.user].groups
    });
  }
});

app.listen(3001, function webStarted() {
  console.log('Started server on port 3001');
});
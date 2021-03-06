var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlfetch = require(path.join(__dirname, '../workers/htmlfetcher'));

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(this.paths.list, 'utf8', (err, data) => {
    if (err) { throw err; }
    var array = data.split('\n');
    cb(array);
  });
};

exports.isUrlInList = function(checkURL, cb) {
  this.readListOfUrls((arr) => {
    if (arr.indexOf(checkURL) > -1) {
      cb(true);
    } else {
      cb(false); 
    }
  });
};

exports.addUrlToList = function(addURL, cb) {
  this.isUrlInList(addURL, (bool) => {
    if (!bool) {
      fs.appendFile(this.paths.list, addURL, 'utf8', cb);
    }
  });
};

exports.isUrlArchived = function(URL, cb) {
  fs.readdir(this.paths.archivedSites, (err, files) => {
    files.indexOf(URL) > -1 ? cb(true) : cb(false);
  });
};

exports.downloadUrls = function(arr) {
  arr = arr.filter(url => url !== '');
  arr.forEach((URL) => {
    exports.isUrlArchived(URL, (bool) => {
      // call Download to download the resource if not exisiting
      if (!bool) {
        htmlfetch.download(URL);
      }
    });
  });
};

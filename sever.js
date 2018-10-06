#!/usr/bin/env node

/**
 * External libraries.
 */
var http = require('http');
var chalk = require('chalk');

/**
 * Log the HTTP request method, url and headers.
 */
function log(req, res) {
  console.log( `${chalk.green(req.method)} ${chalk.cyan(req.url)}` );
  for (var key in req.headers) {
    console.log( `${chalk.blue(key.toUpperCase())}: ${req.headers[key]}` );
  }
  console.log('');
}

/**
 * Get a date one year from now.
 */
function oneYearFromNow() {
  var date = new Date;
  date.setYear(date.getFullYear() + 1);
  return date;
}

function parseCookie(req) {
  var cookies = {};
  var pairs;
  if (req.headers.cookie) {
    pairs =req.headers.cookie.split(/; */);
    pairs.forEach((cookie) => {
      var parts = cookie.split('=');
      var key = parts[0];
      var value = decodeURIComponent(parts[1]);
      cookies[key] = value;
    })
  }
  req.cookies = cookies;
}

/**
 * The main http application.
 */
function app(req, res) {
  log(req);
  parseCookie(req);
  console.log(req.cookies);
  res.setHeader('Set-Cookie', 'app_session=somevalue ; someotherkey=someothervalue');
  res.end();
}

/**
 * Fire up the http server on port 3000.
 */
http.createServer(app).listen(3000);
console.log('http server listening on port 3000');

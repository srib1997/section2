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

/**
 * The main http application.
 */
function app(req, res) {
  log(req);
  
  res.setHeader('Set-Cookie', 'app_session=somevalue');
  res.end();
}

/**
 * Fire up the http server on port 3000.
 */
http.createServer(app).listen(3000);
console.log('http server listening on port 3000');

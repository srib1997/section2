#!/usr/bin/env node

/**
 * External libraries.
 */
var http = require('http');
var chalk = require('chalk');
const crypto = require('crypto');

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
    });
  }
  req.cookies = cookies;
}

function sign(value) {
  var secret = 'super duper secret';
  var signature = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64');
  return value + '--' + signature;
}

function unsign(value) {
  var parts = value.split('--');
  var originalValue = parts[0];
  var checkedValue = sign(originalValue);
  if (checkedValue === value)
    return originalValue;
    else {
      return false;
    }
}

function getSession(req) {
  if (req.cookies['app_session']) {
    var unsigned = unsign(req.cookies['app_session']);
    if(unsigned)
    req.session = JSON.parse(unsigned);
    else {
      console.error('cookie signature no match');
      resetSession(req);
    }
  }else{
    resetSession(req);
  }
}


function setSession(req,res) {
  var expires = oneYearFromNow().toGMTString();
  var serialized = encodeURIComponent(sign(JSON.stringify(req.session)));
  res.setHeader('Set-Cookie', `app_session=${serialized}; Expires=${expires}; Path=/; HttpOnly`);
}

function resetSession(req) {
  req.session = {_id: crypto.randomBytes(8).toString('hex') };
}

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
  parseCookie(req);//req.cookies=[]
  getSession(req);
  console.log(req.session);
  var action = `${req.method} ${req.url}`;

  switch(action) {
    case 'GET /':
      setSession(req, res);
      res.end('homepage\n');
      break;
    case 'GET /login':
    //check 如果PW,AC係岩
      resetSession(req);
      req.session.user_id = 1;
      req.session.logged_in = true;
      setSession(req, res);
      res.end('logged in');
      break;
    case 'GET /logout':
      resetSession(req);
      setSession(req, res);
      res.end('logged out');
      break;
  }
}

/**
 * Fire up the http server on port 3000.
 */
http.createServer(app).listen(3000);
console.log('http server listening on port 3000');

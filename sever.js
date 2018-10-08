#!/usr/bin/env node

/**
 * External libraries.
 */
var http = require('http');
var chalk = require('chalk');
var crypto = require('crypto');
var connect = require('connect');
var app = connect();

app.use( require('./logging')() );
app.use( require('./cookies')() );
app.use( require('./session')() );

app.use(function main(req, res) {
  console.log(req.session);

  var action = `${req.method} ${req.url}`;

  switch(action) {
    case 'GET /':
      res.end('homepage\n');
      break;
    case 'GET /login':
      // check with db if username, password is correct
      req.resetSession();
      req.session.user_id = 1;
      req.session.logged_in = true;
      res.end('logged in');
      break;
    case 'GET /logout':
      req.resetSession();
      res.end('logged out');
      break;
  }
});

/**
 * Fire up the http server on port 3000.
 */
http.createServer(app).listen(3000);
console.log('http server listening on port 3000');
